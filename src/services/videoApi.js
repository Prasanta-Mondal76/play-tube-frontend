import api from "./axios";

export const getAllVideos = async () => {
   return await api.get("/api/v1/videos/all-videos");
};