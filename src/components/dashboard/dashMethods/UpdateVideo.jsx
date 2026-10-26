import { useState, useRef } from "react";
import { X, ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { updateVideoDetails } from "../../../services/videoApi.js";
import { uploadToCloudinary } from "../../../services/cloudinaryUpload.js";

export function UpdateVideo({ video, onClose, setVideos }) {
  const [title, setTitle] = useState(video.title || "");
  const [description, setDescription] = useState(video.description || "");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(video.thumbnail || "");
  const [loading, setLoading] = useState(false);

  const thumbnailInputRef = useRef(null);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file)); // local preview before upload
  };

  const handleUpdate = async () => {
    const data = {};

    // Only send changed fields
    if (title.trim() && title !== video.title) data.title = title.trim();
    if (description.trim() && description !== video.description) data.description = description.trim();

    if (!thumbnailFile && Object.keys(data).length === 0) {
      toast.error("No changes detected.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating video...");
    try {
      // New thumbnail? It goes straight to Cloudinary first (1-stage);
      // the backend only receives the final URL.
      if (thumbnailFile) {
        const uploaded = await uploadToCloudinary(thumbnailFile, { resourceType: "image" });
        data.thumbnailUrl = uploaded.secure_url;
      }

      const res = await updateVideoDetails(video._id, data);
      setVideos((prev) =>
        prev.map((v) => (v._id === video._id ? { ...v, ...res.data.data } : v))
      );
      toast.success("Video updated!", { id: toastId });
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                      bg-night-800 ring-1 ring-white/10 rounded-3xl shadow-2xl shadow-black/60 w-[min(26rem,92vw)] p-6 flex flex-col gap-5 animate-scale-in">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-base">Update Video</h2>
          <button type="button" onClick={onClose} className="cursor-pointer">
            <X className="h-5 w-5 text-zinc-400 hover:text-white transition" />
          </button>
        </div>

        {/* Thumbnail preview + click to change */}
        <div
          className="relative w-full aspect-video rounded-xl overflow-hidden border
                     border-white/10 cursor-pointer group"
          onClick={() => thumbnailInputRef.current.click()}
        >
          {thumbnailPreview ? (
            <img
              src={thumbnailPreview}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-night-850 flex items-center justify-center">
              <ImagePlus className="h-8 w-8 text-zinc-500" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center
                          opacity-0 group-hover:opacity-100 transition">
            <p className="text-white text-sm font-medium flex items-center gap-2">
              <ImagePlus className="h-4 w-4" />
              Change Thumbnail
            </p>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleThumbnailChange}
        />

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-night-850 border border-line rounded-xl px-4 py-2.5 text-sm text-white
                       placeholder:text-zinc-500 outline-none focus:border-ember focus:ring-2
                       focus:ring-ember/20 transition"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="bg-night-850 border border-line rounded-xl px-4 py-2.5 text-sm text-white
                       placeholder:text-zinc-500 outline-none focus:border-ember focus:ring-2
                       focus:ring-ember/20 transition resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white transition 
            cursor-pointer ${loading ? 'disabled:cursor-not-allowed' : null}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading}
            className={`px-5 py-2 rounded-full ember-gradient shadow-lg shadow-ember/30 text-white text-sm cursor-pointer ${loading ? 'disabled:cursor-not-allowed': null}
                       font-semibold hover:brightness-110 transition disabled:opacity-50 `}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}