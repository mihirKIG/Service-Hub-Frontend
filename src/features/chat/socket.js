import io from 'socket.io-client';
import { store } from '@app/store';
import { addMessage, setTyping } from './chatSlice';
import { addNotification } from '@features/notifications/notificationSlice';
import { storage } from '@utils/storage';

let socket = null;

export const connectSocket = (roomId) => {
  const token = storage.getAccessToken();
  
  if (!token) {
    console.error('No auth token found');
    return null;
  }

  const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8001';
  
  socket = io(`${WS_BASE_URL}/chat/${roomId}/`, {
    auth: {
      token,
    },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('message', (data) => {
    store.dispatch(addMessage({ roomId, message: data }));
  });

  socket.on('typing', (data) => {
    store.dispatch(setTyping({ 
      roomId, 
      userId: data.user_id, 
      isTyping: data.is_typing 
    }));
  });

  socket.on('notification', (data) => {
    store.dispatch(addNotification(data));
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendSocketMessage = (message) => {
  if (socket && socket.connected) {
    socket.emit('message', message);
  }
};

export const sendTypingIndicator = (isTyping) => {
  if (socket && socket.connected) {
    socket.emit('typing', { is_typing: isTyping });
  }
};

export default {
  connectSocket,
  disconnectSocket,
  sendSocketMessage,
  sendTypingIndicator,
};
