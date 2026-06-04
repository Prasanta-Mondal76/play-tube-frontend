import api from "./axios";

// router.route("/channel/all-videos").get(getChannelVideos)

// Get Channel Overview
export const getDashStats = async () => {
  return await api.get(`/api/v1/dashboard/overview`);
};

// Get All Videos of Channel 
export const getAllVideos = async () => {
  return await api.get(`/api/v1/dashboard/channel/all-videos`);
};

// Get All Published Videos of Channel 
export const getPublishedVideos = async () => {
  return await api.get(`/api/v1/dashboard/channel/all-published-videos`);
};

// Get All Unpublished Videos of Channel 
export const getUnpublishedVideos = async () => {
  return await api.get(`/api/v1/dashboard/channel/all-unpublished-videos`);
};



