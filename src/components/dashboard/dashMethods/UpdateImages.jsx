import { useRef } from "react";
import { X, UserCircle, Image } from "lucide-react";
import toast from "react-hot-toast";
import { updateAvatar, updateCoverImage } from "../../../services/userApi.js";
import { uploadToCloudinary } from "../../../services/cloudinaryUpload.js";

export function UpdateImages({ setOpenUpdateBox, setChannel }) {
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOpenUpdateBox(false);
    try {
      // 1-stage: image goes straight to Cloudinary, backend gets only the URL
      const uploaded = await uploadToCloudinary(file, { resourceType: "image" });
      const res = await updateAvatar(uploaded.secure_url);
      setChannel((prev) => ({ ...prev, avatar: res.data.data.avatar }));
      toast.success("Profile image updated!", { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed", { id: toastId });
    } finally {
      e.target.value = "";
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOpenUpdateBox(false);
    const toastId = toast.loading("Uploading cover image...");
    try {
      // 1-stage: image goes straight to Cloudinary, backend gets only the URL
      const uploaded = await uploadToCloudinary(file, { resourceType: "image" });
      const res = await updateCoverImage(uploaded.secure_url);
      setChannel((prev) => ({ ...prev, coverImage: res.data.data.coverImage }));
      toast.success("Cover image updated!", { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed", { id: toastId });
    } finally {
      e.target.value = "";
    }
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={() => setOpenUpdateBox(false)}
      />

      {/* MODAL */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                      bg-night-800 ring-1 ring-white/10 rounded-3xl shadow-2xl shadow-black/60 w-[min(20rem,92vw)] p-6 animate-scale-in">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-base">Update Images</h2>
          <button onClick={() => setOpenUpdateBox(false)}>
            <X className="h-5 w-5 text-zinc-400 hover:text-white transition" />
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-night-850 border border-white/5
                       hover:bg-night-700 hover:border-ember/30 text-white text-sm font-medium transition cursor-pointer"
            onClick={() => avatarInputRef.current.click()}
          >
            <UserCircle className="h-5 w-5 text-ember-soft" />
            Update Profile Image
          </button>

          <button
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-night-850 border border-white/5
                       hover:bg-night-700 hover:border-ember/30 text-white text-sm font-medium transition cursor-pointer"
            onClick={() => coverInputRef.current.click()}
          >
            <Image className="h-5 w-5 text-ember-soft" />
            Update Cover Image
          </button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      <input ref={coverInputRef}  type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
    </>
  );
}