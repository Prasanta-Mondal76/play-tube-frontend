import api from "./axios";

/* ==================================================
   REQUEST APIs
================================================== */

export const sendChatRequest = async (receiverId, reason) => {
  const response = await api.post("/api/v1/messages/request", {
    receiverId,
    reason,
  });
  return response.data;
};

export const getReceivedChatRequests = async () => {
  const response = await api.get("/api/v1/messages/requests");
  return response.data;
};

export const acceptChatRequest = async (requestId) => {
  const response = await api.patch(
    `/api/v1/messages/request/${requestId}/accept`
  );
  return response.data;
};

export const rejectChatRequest = async (requestId) => {
  const response = await api.patch(
    `/api/v1/messages/request/${requestId}/reject`
  );
  return response.data;
};

/* ==================================================
   STATUS API
================================================== */

export const getChatConnectionStatus = async (receiverId) => {
  const response = await api.get(`/api/v1/messages/status/${receiverId}`);
  return response.data;
};

/* ==================================================
   CONVERSATION APIs
================================================== */

export const getMyConversations = async () => {
  const response = await api.get("/api/v1/messages/conversations");
  return response.data;
};

/* ==================================================
   MESSAGE APIs
================================================== */

export const getConversationMessages = async (conversationId) => {
  const response = await api.get(
    `/api/v1/messages/conversations/${conversationId}/messages`
  );
  return response.data;
};

export const sendMessage = async (conversationId, text) => {
  const response = await api.post(
    `/api/v1/messages/conversations/${conversationId}/messages`,
    { text }
  );
  return response.data;
};

export const markMessagesAsSeen = async (conversationId) => {
  const response = await api.patch(
    `/api/v1/messages/conversations/${conversationId}/seen`
  );
  return response.data;
};

export const clearChat = async (conversationId) => {
  const response = await api.delete(
    `/api/v1/messages/conversations/${conversationId}/clear`
  );
  return response.data;
};

/* ==================================================
   BLOCK APIs
================================================== */

export const blockUser = async (userId) => {
  const response = await api.post(`/api/v1/blocks/${userId}`);
  return response.data;
};

export const unblockUser = async (userId) => {
  const response = await api.delete(`/api/v1/blocks/${userId}`);
  return response.data;
};

export const getBlockedUsers = async () => {
  const response = await api.get("/api/v1/blocks");
  return response.data;
};