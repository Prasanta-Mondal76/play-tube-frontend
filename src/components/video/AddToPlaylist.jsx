import { useState, useEffect, useContext } from "react";
import { X, Plus, ListVideo } from "lucide-react";
import toast from "react-hot-toast";
import { LoginContext } from "../../context/LoginContextProvider.jsx";
import {
  getUserPlaylists,
  createPlaylist,
  addVideoToPlaylist,
} from "../../services/playlistApi.js";

export function AddToPlaylist({ videoId, onClose }) {
  const { user } = useContext(LoginContext);

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  // Fetch user's existing playlists
  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const res = await getUserPlaylists(user._id);
        setPlaylists(res.data.data);
      } catch {
        // 404 just means no playlists yet — not a real error
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaylists();
  }, [user._id]);

  // Add video to an existing playlist
  const handleAddToExisting = async (playlistId) => {
    const toastId = toast.loading("Adding to playlist...");
    try {
      await addVideoToPlaylist(playlistId, videoId);
      toast.success("Video added to playlist!", { id: toastId });
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add video", { id: toastId });
    }
  };

  // Create new playlist then immediately add video
  const handleCreate = async () => {
    if (!name.trim()) { toast.error("Playlist name is required."); return; }

    // Unique name check on frontend
    const duplicate = playlists.some(
      (p) => p.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (duplicate) { toast.error("You already have a playlist with this name."); return; }

    setCreating(true);
    const toastId = toast.loading("Creating playlist...");
    try {
      const res = await createPlaylist({ name: name.trim(), description: description.trim() });
      const newPlaylist = res.data.data;

      // Auto-add the video
      await addVideoToPlaylist(newPlaylist._id, videoId);

      toast.success("Playlist created & video added!", { id: toastId });
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create playlist", { id: toastId });
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                      bg-zinc-900 rounded-2xl shadow-xl w-96 max-h-[80vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-white font-semibold text-base">Add to Playlist</h2>
          <button type="button" onClick={onClose} className="cursor-pointer">
            <X className="h-5 w-5 text-zinc-400 hover:text-white transition" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 flex flex-col gap-4">

          {/* Create new playlist toggle */}
          {!showCreateForm ? (
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border cursor-pointer
                         border-dashed border-zinc-600 text-zinc-300 hover:text-white 
                         hover:border-zinc-400 transition text-sm"
            >
              <Plus className="h-4 w-4" />
              Create new playlist
            </button>
          ) : (
            /* Create form */
            <div className="flex flex-col gap-3 bg-zinc-800 rounded-xl p-4">
              <h3 className="text-white text-sm font-semibold">New Playlist</h3>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Playlist name (required)"
                maxLength={500}
                className="bg-zinc-700 rounded-lg px-3 py-2 text-sm text-white
                           placeholder:text-zinc-500 outline-none focus:ring-2
                           focus:ring-zinc-500 transition"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="bg-zinc-700 rounded-lg px-3 py-2 text-sm text-white
                           placeholder:text-zinc-500 outline-none focus:ring-2
                           focus:ring-zinc-500 transition resize-none"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={creating}
                  className="px-4 py-1.5 rounded-lg bg-white text-black text-sm
                             font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create & Add"}
                </button>
              </div>
            </div>
          )}

          {/* Existing playlists */}
          <div className="flex flex-col gap-2">
            {loading ? (
              <p className="text-zinc-500 text-sm text-center py-4">Loading playlists...</p>
            ) : playlists.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-4">No playlists yet.</p>
            ) : (
              playlists.map((playlist) => (
                <button
                  key={playlist._id}
                  type="button"
                  onClick={() => handleAddToExisting(playlist._id)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
                             bg-zinc-800 hover:bg-zinc-700 transition text-left"
                >
                  <ListVideo className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-white text-sm font-medium truncate">{playlist.name}</p>
                    {playlist.description && (
                      <p className="text-zinc-500 text-xs truncate">{playlist.description}</p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}