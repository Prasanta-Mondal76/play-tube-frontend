import { useState } from "react";
import { Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { deleteVideo } from "../../../services/videoApi.js";

export function DeleteVideoConfirm({ video, onClose, setVideos }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const toastId = toast.loading("Deleting video...");
    try {
      await deleteVideo(video._id);
      setVideos((prev) => prev.filter((v) => v._id !== video._id));
      toast.success("Video deleted.", { id: toastId });
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                      bg-zinc-900 rounded-2xl shadow-xl w-80 p-6 flex flex-col gap-5">

        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-base">Delete Video</h2>
          <button type="button" onClick={onClose} className="cursor-pointer">
            <X className="h-5 w-5 text-zinc-400 hover:text-white transition" />
          </button>
        </div>

        <p className="text-sm text-zinc-400">
          Are you sure you want to delete{" "}
          <span className="text-white font-medium">"{video.title}"</span>?
          This will also remove it from all playlists, likes, and comments.
          This cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white transition 
            cursor-pointer ${loading ? 'disabled:cursor-not-allowed' : null}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500
                       text-white text-sm font-semibold hover:bg-red-800
                       transition disabled:opacity-50 cursor-pointer ${loading ? 'disabled:cursor-not-allowed' : null}`}
          >
            <Trash2 size={14} />
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </>
  );
}