import { useRef } from "react";
import { X, UserCircle, Image } from "lucide-react";
import toast from "react-hot-toast";
import { updateAvatar, updateCoverImage } from "../../../services/userApi";

export function UpdateImages({ setOpenUpdateBox, setChannel }) {
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);        // must match multer field name

    setOpenUpdateBox(false);
    const toastId = toast.loading("Uploading profile image...");
    try {
      const res = await updateAvatar(formData);
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

    const formData = new FormData();
    formData.append("coverImage", file);    // must match multer field name

    setOpenUpdateBox(false);
    const toastId = toast.loading("Uploading cover image...");
    try {
      const res = await updateCoverImage(formData);
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
        className="fixed inset-0 bg-black/60 z-40"
        onClick={() => setOpenUpdateBox(false)}
      />

      {/* MODAL */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                      bg-zinc-900 rounded-2xl shadow-xl w-80 p-6">

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
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800
                       hover:bg-zinc-700 text-white text-sm font-medium transition cursor-pointer"
            onClick={() => avatarInputRef.current.click()}
          >
            <UserCircle className="h-5 w-5 text-zinc-400" />
            Update Profile Image
          </button>

          <button
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800
                       hover:bg-zinc-700 text-white text-sm font-medium transition cursor-pointer"
            onClick={() => coverInputRef.current.click()}
          >
            <Image className="h-5 w-5 text-zinc-400" />
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