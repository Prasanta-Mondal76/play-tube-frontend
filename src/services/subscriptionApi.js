import api from "./axios";

export const toggleSubscription = async (channelId) => {
  return await api.post(
    `/api/v1/subscriptions/channel/${channelId}`
  );

};

export const getSubscriptionStats = async (channelId) => {

  return await api.get(
    `/api/v1/subscriptions/channel/${channelId}/stats`
  );

};

// Get all channels the user is subscribed to
export const getUserSubscriptions = (userId) =>
  api.get(`/api/v1/subscriptions/subscriptions/${userId}`);
 
// Get all subscribers of a channel (cursor paginated)
export const getChannelSubscribers = (channelId, { cursor, limit = 20 } = {}) => {
  const params = new URLSearchParams({ limit });
  if (cursor) params.append("cursor", cursor);
  return api.get(`/api/v1/subscriptions/subscribers/${channelId}?${params}`);
};