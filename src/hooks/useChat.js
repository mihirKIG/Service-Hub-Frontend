import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket, disconnectSocket, sendSocketMessage, sendTypingIndicator } from '@features/chat/socket';
import { setSocket, setCurrentRoom } from '@features/chat/chatSlice';

const useChat = (roomId) => {
  const dispatch = useDispatch();
  const { currentRoom, messages, typingUsers, isConnected } = useSelector((state) => state.chat);

  useEffect(() => {
    if (roomId) {
      const socket = connectSocket(roomId);
      dispatch(setSocket(socket));
      dispatch(setCurrentRoom(roomId));

      return () => {
        disconnectSocket();
        dispatch(setSocket(null));
      };
    }
  }, [roomId, dispatch]);

  const sendMessage = useCallback((message) => {
    sendSocketMessage(message);
  }, []);

  const setTyping = useCallback((isTyping) => {
    sendTypingIndicator(isTyping);
  }, []);

  return {
    currentRoom,
    messages: messages[roomId] || [],
    typingUsers: typingUsers[roomId] || {},
    isConnected,
    sendMessage,
    setTyping,
  };
};

export default useChat;
