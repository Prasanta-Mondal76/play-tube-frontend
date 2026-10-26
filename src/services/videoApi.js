import api from "./axios.js";

export const getAllVideos = async (params = {}) => {
  return await api.get("/api/v1/videos/all-videos", { params });
};

export const getVideoById = async (videoId) => {
  return await api.get(`/api/v1/videos/get-video/${videoId}`);
};

export const recordVideoView = async (videoId) => {
  return await api.post(`/api/v1/videos/views/${videoId}`);
};

export const getSuggestedVideos = async (params = {}) => {
  return await api.get("/api/v1/videos/all-videos", { params });
};


export const getChannelVideos = async (channelId, params = {}) => {
  return await api.get(
    `/api/v1/videos/user/all-videos/${channelId}`,
    { params }
  );
};


// 1-stage flow: the video + thumbnail are already on Cloudinary
// (uploaded directly by the browser) — this only sends their URLs
// and details as JSON for saving in the database.
export const publishVideo = async (data) => {
  const response = await api.post("/api/v1/videos/publish-video", data);
  return response.data;
};


export const updateVideoDetails = async (videoId, data) => {
  return await api.patch(`/api/v1/videos/update-video-details/${videoId}`, data);
};

export const deleteVideo = async (videoId) => {
  return await api.delete(`/api/v1/videos/delete-video/${videoId}`);
};

export const togglePublishStatus = async (videoId) => {
  return await api.patch(`/api/v1/videos/toggle-published/${videoId}`);
};


export const searchVideos = async (query) => {
  return await api.get("/api/v1/videos/search", { params: { q: query } });
};