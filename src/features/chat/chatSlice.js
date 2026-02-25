import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatApi } from '@api/chatApi';

// Async thunks
export const fetchChatRooms = createAsyncThunk(
  'chat/fetchChatRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApi.getChatRooms();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ roomId, params }, { rejectWithValue }) => {
    try {
      const response = await chatApi.getMessages(roomId, params);
      return { roomId, messages: response.data.results || response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ roomId, data }, { rejectWithValue }) => {
    try {
      const response = await chatApi.sendMessage(roomId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'chat/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApi.getUnreadCount();
      return response.data.count;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  chatRooms: [],
  currentRoom: null,
  messages: {},
  unreadCount: 0,
  socket: null,
  isConnected: false,
  typingUsers: {},
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    addMessage: (state, action) => {
      const { roomId, message } = action.payload;
      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }
      state.messages[roomId].push(message);
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
      state.isConnected = !!action.payload;
    },
    setTyping: (state, action) => {
      const { roomId, userId, isTyping } = action.payload;
      if (!state.typingUsers[roomId]) {
        state.typingUsers[roomId] = {};
      }
      if (isTyping) {
        state.typingUsers[roomId][userId] = true;
      } else {
        delete state.typingUsers[roomId][userId];
      }
    },
    markRoomAsRead: (state, action) => {
      const room = state.chatRooms.find(r => r.id === action.payload);
      if (room) {
        room.unread_count = 0;
      }
    },
    clearChat: (state) => {
      state.currentRoom = null;
      state.messages = {};
      state.socket = null;
      state.isConnected = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chat rooms
      .addCase(fetchChatRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.chatRooms = action.payload.results || action.payload;
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch messages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages[action.payload.roomId] = action.payload.messages;
      })
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const roomId = action.payload.chatroom;
        if (!state.messages[roomId]) {
          state.messages[roomId] = [];
        }
        state.messages[roomId].push(action.payload);
      })
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  },
});

export const {
  setCurrentRoom,
  addMessage,
  setSocket,
  setTyping,
  markRoomAsRead,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
