import { useState, useContext, useRef } from "react";
import toast from "react-hot-toast";
import { LoginContext } from "../../context/LoginContextProvider.jsx";
import { updateAvatar, updateCoverImage, updateAbout } from "../../services/userApi.js";
import { uploadToCloudinary } from "../../services/cloudinaryUpload.js";
import { Camera, ImagePlus, Plus, X, Link2, Pencil } from "lucide-react";

const inputCls = `
  w-full bg-night-850 border border-line rounded-xl px-4 py-2.5 text-sm text-white
  placeholder:text-zinc-500 outline-none focus:border-ember focus:ring-2
  focus:ring-ember/20 transition
`;

const btnCls = `
  self-end px-6 py-2.5 rounded-full ember-gradient shadow-lg shadow-ember/30 text-white text-sm
  font-semibold hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50
  disabled:cursor-not-allowed cursor-pointer
`;

function Card({ title, description, children }) {
  return (
    <div className="bg-night-900 border border-white/5 rounded-3xl p-6 flex flex-col gap-5 animate-fade-up">
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {description && <p className="text-xs text-zinc-500 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function SettingsProfile() {
  const { user, setUser } = useContext(LoginContext);

  // ── Avatar ──────────────────────────────────────────────
  const avatarInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile]       = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) { toast.error("No image selected."); return; }
    setAvatarLoading(true);
    const tid = toast.loading("Uploading avatar...");
    try {
      // 1-stage: straight to Cloudinary, backend gets only the URL
      const uploaded = await uploadToCloudinary(avatarFile, { resourceType: "image" });
      const res = await updateAvatar(uploaded.secure_url);
      setUser(res.data.data);
      setAvatarPreview(null);
      setAvatarFile(null);
      toast.success("Avatar updated!", { id: tid });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed", { id: tid });
    } finally { setAvatarLoading(false); }
  };

  // ── Cover Image ─────────────────────────────────────────
  const coverInputRef = useRef(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile]       = useState(null);
  const [coverLoading, setCoverLoading] = useState(false);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleCoverUpload = async () => {
    if (!coverFile) { toast.error("No image selected."); return; }
    setCoverLoading(true);
    const tid = toast.loading("Uploading cover image...");
    try {
      // 1-stage: straight to Cloudinary, backend gets only the URL
      const uploaded = await uploadToCloudinary(coverFile, { resourceType: "image" });
      const res = await updateCoverImage(uploaded.secure_url);
      setUser(res.data.data);
      setCoverPreview(null);
      setCoverFile(null);
      toast.success("Cover image updated!", { id: tid });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed", { id: tid });
    } finally { setCoverLoading(false); }
  };

  // ── About ───────────────────────────────────────────────
  const [about, setAbout]           = useState(user?.about || "");
  const [aboutLoading, setAboutLoading] = useState(false);
  const aboutLimit = 300;

  const handleAboutSave = async () => {
    setAboutLoading(true);
    const tid = toast.loading("Saving about...");
    try {
      const res = await updateAbout(about);
      setUser(res.data.data);
      toast.success("About updated!", { id: tid });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed", { id: tid });
    } finally { setAboutLoading(false); }
  };


  return (
    <div className="px-4 py-8 max-w-2xl mx-auto flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Profile</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Manage your public profile appearance.
        </p>
      </div>

      {/* ── Avatar ─────────────────────────────────────────── */}
      <Card title="Avatar" description="Your profile picture shown across PlayTube.">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Preview */}
          <div className="relative shrink-0">
            <img
              src={avatarPreview || user?.avatar}
              alt="Avatar"
              className="h-24 w-24 rounded-full object-cover ring-2 ring-ember/40"
            />
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full ember-gradient shadow-lg shadow-ember/30
                         flex items-center justify-center hover:brightness-110 transition cursor-pointer"
            >
              <Camera className="h-4 w-4 text-white" />
            </button>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <p className="text-sm text-zinc-400">
              {avatarPreview ? "New image selected — click upload to save." : "Click the camera icon to choose a new avatar."}
            </p>
            {avatarPreview && (
              <div className="flex gap-3">
                <button onClick={handleAvatarUpload} disabled={avatarLoading} className={`${btnCls} self-auto`}>
                  {avatarLoading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={() => { setAvatarPreview(null); setAvatarFile(null); }}
                  className="px-4 py-2 rounded-full bg-night-700 text-zinc-300 text-sm hover:bg-night-600 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </Card>

      {/* ── Cover Image ─────────────────────────────────────── */}
      <Card title="Cover Image" description="Banner image shown on your channel page.">
        {/* Cover preview */}
        <div
          className="relative w-full h-36 rounded-xl overflow-hidden bg-night-800 border border-white/5 cursor-pointer group"
          onClick={() => coverInputRef.current?.click()}
        >
          {(coverPreview || user?.coverImage) ? (
            <img
              src={coverPreview || user?.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600">
              <ImagePlus className="h-8 w-8 mb-2" />
              <span className="text-sm">Click to add cover image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                          transition flex items-center justify-center">
            <ImagePlus className="h-7 w-7 text-white" />
          </div>
        </div>

        {coverPreview && (
          <div className="flex gap-3">
            <button onClick={handleCoverUpload} disabled={coverLoading} className={`${btnCls} self-auto`}>
              {coverLoading ? "Uploading..." : "Upload Cover"}
            </button>
            <button
              onClick={() => { setCoverPreview(null); setCoverFile(null); }}
              className="px-4 py-2 rounded-full bg-night-700 text-zinc-300 text-sm hover:bg-night-600 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
      </Card>

      {/* ── About ───────────────────────────────────────────── */}
      <Card title="About" description="Write a short bio that appears on your channel.">
        <div className="flex flex-col gap-1">
          <div className="relative">
            <textarea
              value={about}
              onChange={(e) => { if (e.target.value.length <= aboutLimit) setAbout(e.target.value); }}
              placeholder="Tell viewers about yourself..."
              rows={4}
              className="w-full bg-night-850 border border-line rounded-xl px-4 py-3 text-sm text-white
                         placeholder:text-zinc-500 outline-none focus:border-ember focus:ring-2
                         focus:ring-ember/20 transition resize-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600">{about.length} / {aboutLimit}</span>
            <button onClick={handleAboutSave} disabled={aboutLoading} className={btnCls}>
              {aboutLoading ? "Saving..." : "Save About"}
            </button>
          </div>
        </div>
      </Card>

    </div>
  );
}