import api from "./axios";

export const getLoginStats = async () => {
  return await api.get("/api/v1/users/login-stats")
}

export const getCurrentUser = async () => {
  return await api.get("/api/v1/users/current-user");
};

// Channel details by username
export const getChannelDetails = async (username) => {
  return await api.get(`/api/v1/users/channel/${username}`);
};