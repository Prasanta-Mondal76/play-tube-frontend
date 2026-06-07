import api from "./axios";

// Get Channel Overview
export const getDashStats = async () => {
  return await api.get(`/api/v1/dashboard/overview`);
};

// Get All Videos of Channel 
export const getAllVideos = async () => {
  return await api.get(`/api/v1/dashboard/channel/all-videos`);
};



