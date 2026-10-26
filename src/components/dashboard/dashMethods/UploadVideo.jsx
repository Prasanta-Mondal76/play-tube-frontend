import { useState } from "react";
import { publishVideo } from "../../../services/videoApi.js";
import { uploadToCloudinary } from "../../../services/cloudinaryUpload.js";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export function UploadVideo({ setOpenUploadBox }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(""); // "video" | "thumbnail" | "saving"

  const handleUpload = async (e) => {

    e.preventDefault();
    if (loading) return;
    if (!videoFile) {
      toast.error("Please select a video file.");
      return;
    }


    try {

      setLoading(true);
      setProgress(0);
      setPhase("video");

      // STEP 1 — Video goes STRAIGHT from the browser to Cloudinary.
      // One single journey, so this percentage is 100% real.
      const videoRes = await uploadToCloudinary(videoFile, {
        resourceType: "video",
        onProgress: setProgress,
      });

      // STEP 2 — Thumbnail (small image, also direct to Cloudinary)
      let thumbnailUrl;
      if (thumbnail) {
        setPhase("thumbnail");
        toast.loading("Uploading thumbnail...", { id: toastId });
        const thumbRes = await uploadToCloudinary(thumbnail, {
          resourceType: "image",
        });
        thumbnailUrl = thumbRes.secure_url;
      }

      // STEP 3 — Save the Cloudinary URLs + details in our database
      setPhase("saving");

      const result = await publishVideo({
        title,
        description,
        isPublished,
        videoUrl: videoRes.secure_url,
        thumbnailUrl,
        duration: videoRes.duration,
      });

      console.log(result);

      toast.success("Video Uploaded Successfully 🚀", { id: toastId });

      setOpenUploadBox(false);

    } catch (error) {

      console.log(error);
      console.log(error?.response?.data?.message);

      toast.error(error?.response?.data?.message || "Upload failed", { id: toastId });

    } finally {

      setLoading(false);
      setPhase("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center animate-fade-in px-4"
      onClick={() => { if (!loading) setOpenUploadBox(false); }}

    >

      <form
        onSubmit={handleUpload}
        onClick={(e) => e.stopPropagation()}
        className="bg-night-800 w-full max-w-[500px] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl shadow-black/60 animate-scale-in max-h-[90vh] overflow-y-auto"
      >

        <div className="flex items-center justify-between mb-6">

          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Upload Video
          </h1>

          <button
            type="button"
            onClick={() => setOpenUploadBox(false)}
            className="
              p-2 rounded-lg
              text-zinc-400
              hover:bg-night-700
              hover:text-white
              transition-all
              cursor-pointer
            "
          >
            <X size={20} />
          </button>

        </div>

        {/* TITLE */}
        <input
          type="text"
          required
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-night-850 border border-line text-white placeholder:text-zinc-600 outline-none focus:border-ember focus:ring-2 focus:ring-ember/20 transition"
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-night-850 border border-line text-white placeholder:text-zinc-600 outline-none focus:border-ember focus:ring-2 focus:ring-ember/20 transition resize-none"
        />

        {/* VIDEO */}
        <div className="mb-4">
          <p className="text-sm text-zinc-400 mb-2">
            Select Video
          </p>

          <input
            type="file"
            required
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="text-sm text-zinc-400 cursor-pointer file:mr-3 file:rounded-full file:border-0 file:bg-night-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-night-600 file:cursor-pointer file:transition"
            
          />
        </div>

        {/* THUMBNAIL */}
        <div className="mb-4">
          <p className="text-sm text-zinc-400 mb-2">
            Add Thumbnail
          </p>

          <input
            type="file"
            required
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="text-sm text-zinc-400 cursor-pointer file:mr-3 file:rounded-full file:border-0 file:bg-night-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-night-600 file:cursor-pointer file:transition"
          />
        </div>

        {/* PUBLISH */}
        <div className="flex items-center gap-2 mb-6">

          <input
            type="checkbox"
            checked={isPublished}
            onChange={() => setIsPublished(!isPublished)}
            className="cursor-pointer h-4 w-4 accent-[#E50914]"
          />

          <p className="text-zinc-300 text-sm">
            Publish now
          </p>

        </div>

        {/* UPLOAD PROGRESS — one single stage, real percentage */}
        {loading && (
          <div className="mb-4 animate-fade-in">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400">
                {phase === "video"
                  ? "Uploading video…"
                  : phase === "thumbnail"
                    ? "Uploading thumbnail…"
                    : "Saving…"}
              </span>
              {phase === "video" && (
                <span className="font-bold text-ember-soft">{progress}%</span>
              )}
            </div>
            <div className="h-2 rounded-full bg-night-700 overflow-hidden">
              <div
                className={`h-full ember-gradient rounded-full transition-all duration-300 ease-out ${phase !== "video" ? "w-full animate-pulse" : ""}`}
                style={phase === "video" ? { width: `${progress}%` } : undefined}
              />
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-500 mt-2">
              Your video uploads directly to the cloud — one single stage,
              real percentage. Don't close this window.
            </p>
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-3 rounded-full
            ember-gradient shadow-lg shadow-ember/30 hover:brightness-110
            text-white font-semibold
            transition-all ${loading ? "cursor-not-allowed" : "cursor-pointer"}`
          }
        >
          {
            loading
              ? phase === "video"
                ? `Uploading ${progress}%`
                : phase === "thumbnail"
                  ? "Uploading thumbnail…"
                  : "Saving…"
              : "Upload Video"
          }
        </button>

      </form>
    </div>
  );
}
