import axiosClient from './axiosClient';

export const chatApi = {
  // Get all chat rooms
  getChatRooms: () => axiosClient.get('/chat/rooms/'),

  // Get chat room by ID
  getChatRoomById: (id) => axiosClient.get(`/chat/rooms/${id}/`),

  // Create or get chat room with a provider
  createChatRoom: (providerId) => 
    axiosClient.post('/chat/rooms/create/', { provider_id: providerId }),

  // Get messages for a chat room
  getMessages: (roomId, params) => 
    axiosClient.get(`/chat/rooms/${roomId}/messages/`, { params }),

  // Send message
  sendMessage: (roomId, data) => 
    axiosClient.post(`/chat/rooms/${roomId}/messages/send/`, data),

  // Upload file/attachment
  uploadFile: (roomId, formData) => 
    axiosClient.post(`/chat/rooms/${roomId}/upload/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Mark messages as read
  markAsRead: (roomId) => 
    axiosClient.post(`/chat/rooms/${roomId}/mark-read/`),

  // Get unread message count
  getUnreadCount: () => 
    axiosClient.get('/chat/unread-count/'),

  // Search messages
  searchMessages: (roomId, query) => 
    axiosClient.get(`/chat/rooms/${roomId}/search/`, { 
      params: { q: query } 
    }),

  // Delete message
  deleteMessage: (roomId, messageId) => 
    axiosClient.delete(`/chat/rooms/${roomId}/messages/${messageId}/`),

  // Get online status
  getOnlineStatus: (userId) => 
    axiosClient.get(`/chat/users/${userId}/status/`),
};
