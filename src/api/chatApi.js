import axiosClient from './axiosClient';

export const chatApi = {
  // Chat rooms
  getChatRooms: () => axiosClient.get('/chat/rooms/'),

  createChatRoom: (data) => axiosClient.post('/chat/rooms/create/', data),

  getChatRoomById: (id) => axiosClient.get(`/chat/rooms/${id}/`),

  deleteChatRoom: (id) => axiosClient.delete(`/chat/rooms/${id}/delete/`),

  // Messages
  getMessages: (chatRoomId, params) => 
    axiosClient.get(`/chat/rooms/${chatRoomId}/messages/`, { params }),

  sendMessage: (chatRoomId, data) => 
    axiosClient.post(`/chat/rooms/${chatRoomId}/messages/send/`, data),

  markMessagesAsRead: (chatRoomId) => 
    axiosClient.post(`/chat/rooms/${chatRoomId}/mark-read/`),

  deleteMessage: (chatRoomId, messageId) => 
    axiosClient.delete(`/chat/rooms/${chatRoomId}/messages/${messageId}/delete/`),

  // Unread count
  getUnreadCount: () => axiosClient.get('/chat/unread-count/'),

  // Upload attachment
  uploadAttachment: (chatRoomId, formData) => 
    axiosClient.post(`/chat/rooms/${chatRoomId}/messages/send/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
