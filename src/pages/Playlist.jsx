import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Plus, Trash2, X, ListVideo, ListVideoIcon, Home } from "lucide-react";
import toast from "react-hot-toast";
import { LoginContext } from "../context/LoginContextProvider.jsx";
import {
  getUserPlaylists,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  removeVideoFromPlaylist,
} from "../services/playlistApi.js";

export function Playlist() {
  const { user, isLogIn } = useContext(LoginContext);
  const navigate = useNavigate();

  // ── View state: "list" = all playlists, "detail" = one playlist's videos
  const [view, setView] = useState("list");
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected playlist detail
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Create form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  // Three-dot menu open for which video
  const [openMenuVideoId, setOpenMenuVideoId] = useState(null);

  // Fetch all playlists
  useEffect(() => {
    if (!user?._id) return;
    async function fetchPlaylists() {
      try {
        const res = await getUserPlaylists(user._id);
        setPlaylists(res.data.data);
      } catch {
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaylists();
  }, [user?._id]);

  // Open a playlist → fetch its full details (with videos populated)
  const handleOpenPlaylist = async (playlistId) => {
    setDetailLoading(true);
    setView("detail");
    try {
      const res = await getPlaylistById(playlistId);
      setActivePlaylist(res.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load playlist");
      setView("list");
    } finally {
      setDetailLoading(false);
    }
  };

  // Create new playlist
  const handleCreate = async () => {
    if (!name.trim()) { toast.error("Playlist name is required."); return; }

    const duplicate = playlists.some(
      (p) => p.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (duplicate) { toast.error("You already have a playlist with this name."); return; }

    setCreating(true);
    const toastId = toast.loading("Creating playlist...");
    try {
      const res = await createPlaylist({ name: name.trim(), description: description.trim() });
      setPlaylists((prev) => [res.data.data, ...prev]);
      toast.success("Playlist created!", { id: toastId });
      setName("");
      setDescription("");
      setShowCreateForm(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create playlist", { id: toastId });
    } finally {
      setCreating(false);
    }
  };

  // Delete playlist
  const handleDeletePlaylist = async (playlistId) => {
    const toastId = toast.loading("Deleting playlist...");
    try {
      await deletePlaylist(playlistId);
      setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
      toast.success("Playlist deleted.", { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete", { id: toastId });
    }
  };

  // Remove video from active playlist
  const handleRemoveVideo = async (videoId) => {
    const toastId = toast.loading("Removing video...");
    try {
      await removeVideoFromPlaylist(activePlaylist._id, videoId);
      setActivePlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
      toast.success("Video removed.", { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove video", { id: toastId });
    } finally {
      setOpenMenuVideoId(null);
    }
  };

  // ── RENDER: Playlist detail view ──────────────────────────────────────────
  if (view === "detail") {
    return (
      <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
        <div className="max-w-2xl mx-auto">

          <button
            type="button"
            onClick={() => { setView("list"); setActivePlaylist(null); }}
            className="text-zinc-400 hover:text-white text-sm mb-6 transition"
          >
            ← Back to playlists
          </button>

          {detailLoading ? (
            <p className="text-zinc-500 text-center py-20">Loading...</p>
          ) : (
            <>
              <h1 className="text-2xl font-bold">{activePlaylist?.name}</h1>
              {activePlaylist?.description && (
                <p className="text-zinc-400 text-sm mt-1">{activePlaylist.description}</p>
              )}

              <div className="mt-6 flex flex-col gap-3">
                {activePlaylist?.videos?.length === 0 ? (
                  <p className="text-zinc-500 text-center py-10">No videos in this playlist.</p>
                ) : (
                  activePlaylist?.videos?.map((video) => (
                    <div
                      key={video._id}
                      className="flex items-center gap-3 bg-zinc-900 rounded-xl p-3 relative"
                    >
                      {/* Thumbnail */}
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-28 h-16 rounded-lg object-cover shrink-0 cursor-pointer"
                        onClick={() => navigate(`/watch/${video._id}`)}
                      />

                      {/* Info */}
                      <div
                        className="flex-1 overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/watch/${video._id}`)}
                      >
                        <p className="text-white text-sm font-medium truncate">{video.title}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{video.views} views</p>
                      </div>

                      {/* Three-dot menu */}
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuVideoId(
                              openMenuVideoId === video._id ? null : video._id
                            )
                          }
                          className="p-2 rounded-full hover:bg-zinc-700 transition"
                        >
                          <MoreVertical className="h-4 w-4 text-zinc-400" />
                        </button>

                        {openMenuVideoId === video._id && (
                          <div className="absolute right-0 top-8 bg-zinc-800 rounded-xl
                                          shadow-lg z-10 overflow-hidden w-36">
                            <button
                              type="button"
                              onClick={() => handleRemoveVideo(video._id)}
                              className="flex items-center gap-2 w-full px-4 py-3 text-sm
                                         text-red-400 hover:bg-zinc-700 transition"
                            >
                              <X className="h-4 w-4" />
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── RENDER: All playlists list ─────────────────────────────────────────────
  return (
    isLogIn ?
      <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">My Playlists</h1>
              <p className="text-zinc-400 text-sm mt-1">{playlists.length} playlists</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 cursor-pointer
                       text-white text-sm font-semibold hover:bg-blue-900 transition"
            >
              <Plus className="h-4 w-4" />
              New Playlist
            </button>
          </div>

          {/* Create form modal */}
          {showCreateForm && (
            <>
              <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowCreateForm(false)} />
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                            bg-zinc-900 rounded-2xl shadow-xl w-96 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-semibold">New Playlist</h2>
                  <button type="button" className="cursor-pointer" onClick={() => setShowCreateForm(false)}>
                    <X className="h-5 w-5 text-zinc-400 hover:text-white transition" />
                  </button>
                </div>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Playlist name (required)"
                  maxLength={200}
                  className="bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white
                           placeholder:text-zinc-500 outline-none focus:ring-2
                           focus:ring-zinc-600 transition"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description (optional)"
                  rows={3}
                  maxLength={250}
                  className="bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white
                           placeholder:text-zinc-500 outline-none focus:ring-2
                           focus:ring-zinc-600 transition resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={creating}
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm cursor-pointer
                             font-semibold hover:bg-blue-900 transition disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Playlists list */}
          {loading ? (
            <p className="text-zinc-500 text-center py-20">Loading playlists...</p>
          ) : playlists.length === 0 ? (
            <p className="text-zinc-500 text-center py-20">No playlists yet. Create one!</p>
          ) : (
            <div className="flex flex-col gap-3">
              {playlists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="flex items-center gap-4 bg-zinc-900 rounded-xl p-4
                           hover:bg-zinc-800 transition cursor-pointer"
                  onClick={() => handleOpenPlaylist(playlist._id)}
                >
                  <ListVideo className="h-8 w-8 text-zinc-500 shrink-0" />

                  <div className="flex-1 overflow-hidden">
                    <p className="text-white font-medium truncate">{playlist.name}</p>
                    {playlist.description && (
                      <p className="text-zinc-500 text-sm truncate mt-0.5">{playlist.description}</p>
                    )}
                    <p className="text-zinc-600 text-xs mt-1">{playlist.videos?.length || 0} videos</p>
                  </div>

                  {/* Delete button — stopPropagation so it doesn't open the playlist */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(playlist._id); }}
                    className="p-2 rounded-full hover:bg-zinc-700 transition shrink-0"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      :
      
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-5 px-4 text-white">
        <ListVideoIcon size={56} className="text-gray-500" />
        <h2 className="text-2xl font-bold text-center">
          Sign in to view your playlists
        </h2>
        <p className="text-gray-400 text-center text-sm max-w-xs">
          Create, save, and manage your favorite playlists by logging into your account.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mt-2 bg-white text-black font-semibold px-6 py-2.5 rounded-full hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
        >
          <Home size={16} />
          Back to Home
        </button>
      </div>
  );
}