import api from "./axios";

export const getAllVideos = async () => {
  return await api.get("/api/v1/videos/all-videos");
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


export const publishVideo = async (formData) => {

  const response = await api.post(
    "/api/v1/videos/publish-video",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const updateVideoDetails = async (videoId, formData) => {
  return await api.patch(`/api/v1/videos/update-video-details/${videoId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteVideo = async (videoId) => {
  return await api.delete(`/api/v1/videos/delete-video/${videoId}`);
};

export const togglePublishStatus = async (videoId) => {
  return await api.patch(`/api/v1/videos/toggle-published/${videoId}`);
};