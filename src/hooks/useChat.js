import { useState, useEffect, useCallback, useRef } from 'react';
import { chatApi } from '../api/chatApi';

export const useChatRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChatRooms();
    fetchUnreadCount();

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatApi.getChatRooms();
      setRooms(response.data.results || response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await chatApi.getUnreadCount();
      setUnreadCount(response.data.unread_count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const createRoom = async (data) => {
    try {
      const response = await chatApi.createChatRoom(data);
      await fetchChatRooms();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

  return {
    rooms,
    unreadCount,
    loading,
    error,
    refetch: fetchChatRooms,
    createRoom,
  };
};

export const useChat = (roomId) => {
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (roomId) {
      fetchRoom();
      fetchMessages();
      connectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      const response = await chatApi.getChatRoomById(roomId);
      setRoom(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatApi.getMessages(roomId);
      setMessages(response.data.results || response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const token = localStorage.getItem('access_token');
    const wsUrl = `ws://localhost:8000/ws/chat/${roomId}/?token=${token}`;
    
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'message') {
        setMessages((prev) => [...prev, data.message]);
      } else if (data.type === 'typing') {
        setTypingUsers(data.users);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      
      // Reconnect after 3 seconds
      setTimeout(() => {
        if (roomId) {
          connectWebSocket();
        }
      }, 3000);
    };
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const sendMessage = useCallback(async (message) => {
    try {
      const response = await chatApi.sendMessage(roomId, { message });
      
      // Add message optimistically if WebSocket is not connected
      if (!isConnected) {
        setMessages((prev) => [...prev, response.data]);
      }
      
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  }, [roomId, isConnected]);

  const sendAttachment = useCallback(async (file) => {
    try {
      const formData = new FormData();
      formData.append('attachment', file);
      
      const response = await chatApi.uploadAttachment(roomId, formData);
      
      if (!isConnected) {
        setMessages((prev) => [...prev, response.data]);
      }
      
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  }, [roomId, isConnected]);

  const markAsRead = useCallback(async () => {
    try {
      await chatApi.markMessagesAsRead(roomId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  }, [roomId]);

  const setTyping = useCallback((isTyping) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        is_typing: isTyping,
      }));
    }
  }, [isConnected]);

  return {
    room,
    messages,
    loading,
    error,
    isConnected,
    typingUsers,
    sendMessage,
    sendAttachment,
    markAsRead,
    setTyping,
    refetch: fetchMessages,
  };
};

export default useChat;
