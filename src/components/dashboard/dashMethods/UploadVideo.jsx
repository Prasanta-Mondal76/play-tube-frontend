import { useState } from "react";
import { publishVideo } from "../../../services/videoApi";
import { X } from "lucide-react";

export function UploadVideo({ setOpenUploadBox }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const formData = new FormData();

      // MUST MATCH BACKEND
      formData.append("title", title);

      formData.append("description", description);

      formData.append("videoFile", videoFile);

      formData.append("thumbnail", thumbnail);

      formData.append("isPublished", isPublished);

      console.log("FORM DATA = ", formData)

      const result = await publishVideo(formData);

      console.log(result);

      alert("Video Uploaded Successfully");

      setOpenUploadBox(false);

    } catch (error) {

      console.log(error);
      console.log(error?.response?.data?.message);

      alert(
        error?.response?.data?.message || "Upload failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center"
    onClick={() => setOpenUploadBox(false)}
      
    >

      <form
        onSubmit={handleUpload}
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 w-[500px] rounded-2xl p-6 border border-zinc-700"
      >

        <div className="flex items-center justify-between mb-6">

          <h1 className="text-2xl font-bold text-white">
            Upload Video
          </h1>

          <button
            type="button"
            onClick={() => setOpenUploadBox(false)}
            className="
              p-2 rounded-lg
              text-zinc-400
              hover:bg-zinc-800
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
          className="w-full mb-4 p-3 rounded-lg bg-zinc-800 text-white outline-none"
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-zinc-800 text-white outline-none"
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
            className="text-white cursor-pointer"
            required
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
            className="text-white cursor-pointer"
          />
        </div>

        {/* PUBLISH */}
        <div className="flex items-center gap-2 mb-6">

          <input
            type="checkbox"
            checked={isPublished}
            onChange={() => setIsPublished(!isPublished)}
            className="cursor-pointer"
          />

          <p className="text-zinc-300 text-sm">
            Publish now
          </p>

        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-3 rounded-xl
            bg-purple-600 hover:bg-purple-800
            text-white font-semibold 
            transition-all ${loading? "cursor-not-allowed" : "cursor-pointer"}` 
          }
        >
          {
            loading
              ? "Uploading..."
              : "Upload Video"
          }
        </button>

      </form>
    </div>
  );
}