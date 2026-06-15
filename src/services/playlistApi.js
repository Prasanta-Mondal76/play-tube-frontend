import api from "./axios.js";

export const createPlaylist = async (data) =>
  await api.post("/api/v1/playlists/create-playlist", data);

export const getUserPlaylists = async (userId) =>
  await api.get(`/api/v1/playlists/get-playlists/${userId}`);

export const addVideoToPlaylist = async (playlistId, videoId) =>
  await api.post(`/api/v1/playlists/add-video/${playlistId}/video/${videoId}`);

export const removeVideoFromPlaylist = async (playlistId, videoId) =>
  await api.delete(`/api/v1/playlists/remove-video/${playlistId}/video/${videoId}`);

export const deletePlaylist = async (playlistId) =>
  await api.delete(`/api/v1/playlists/delete-video/${playlistId}`);

export const getPlaylistById = async (playlistId) =>
  await api.get(`/api/v1/playlists/get-playlist/${playlistId}`);