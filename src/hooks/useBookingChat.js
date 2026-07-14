import { useState, useEffect } from 'react';
import { chatApi } from '../api/chatApi';
import { useChat } from './useChat';

/**
 * Hook for booking-based chat
 * Backend handles room creation/retrieval by booking_id
 */
export const useBookingChat = (bookingId) => {
  const [chatRoom, setChatRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get or create chat room for this booking
  useEffect(() => {
    if (bookingId) {
      console.log('🔵 useBookingChat called with booking ID:', bookingId);
      initializeChatRoom();
    } else {
      console.log('⚠️ Waiting for booking ID...');
      setLoading(false);
    }
  }, [bookingId]);

  const initializeChatRoom = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔵 Creating/getting chat room for booking:', bookingId);
      console.log('🔵 Starting API call to /chat/rooms/create/');

      // Backend expects booking_id to create/get chat room
      const createData = {
        booking_id: bookingId,
      };
      
      console.log('🔵 Sending request with data:', createData);
      console.log('🔵 About to call chatApi.createChatRoom...');
      
      const roomResponse = await chatApi.createChatRoom(createData);
      console.log('✅ Chat room ready:', roomResponse.data);
      setChatRoom(roomResponse.data);
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(errorMsg);
      console.error('❌ Failed to initialize chat room:', err);
      console.error('❌ Error details:', err.response?.data);
      console.error('❌ Full error:', err);
    } finally {
      console.log('🔵 Chat room initialization complete');
      setLoading(false);
    }
  };

  // Use the regular chat hook once we have the room ID
  const chat = useChat(chatRoom?.id);

  return {
    chatRoom,
    loading: loading || chat.loading,
    error: error || chat.error,
    ...chat,
    bookingId,
  };
};

export default useBookingChat;
