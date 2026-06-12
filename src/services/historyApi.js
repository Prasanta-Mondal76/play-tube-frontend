import api from "./axios";

export const updateHistory = async(videoId) => {
  return await api.post(`/api/v1/history/update/${videoId}`)
}

export const getHistory = async(days = 30) =>{
  return await api.get(`/api/v1/history/get-history?days=${days}`)
}

export const clearWatchHistory = async () => {
  return await api.delete("/api/v1/history/clear");
};
 
export const togglePauseHistory = async () => {
  return await api.patch("/api/v1/history/pause-toggle");
};