import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LoginContext } from "../context/LoginContextProvider";
import { updateUserData, initiateEmailChange, verifyEmailChange } from "../services/userApi";

export function UpdateProfile() {
  const { user, setUser } = useContext(LoginContext);
  const navigate = useNavigate();

  // --- Profile form (fullName + username) ---
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setUsername(user.username || "");
    }
  }, [user]);

  const [profileLoading, setProfileLoading] = useState(false);

  // --- Email form ---
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // --- OTP step ---
  const [otpSent, setOtpSent] = useState(false);   // controls whether OTP input shows
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  // ─── Submit: fullName / username ──────────────────────────────────────────
  const handleProfileSubmit = async () => {
    // Only send fields that actually changed
    const payload = {};
    if (fullName !== user?.fullName) payload.fullName = fullName;
    if (username !== user?.username) payload.username = username;

    if (Object.keys(payload).length === 0) {
      toast.error("No changes detected.");
      return;
    }

    setProfileLoading(true);
    const toastId = toast.loading("Saving changes...");
    try {
      const res = await updateUserData(payload);
      setUser(res.data.data);                        // update global user context
      toast.success("Profile updated!", { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed", { id: toastId });
    } finally {
      setProfileLoading(false);
    }
  };

  // ─── Submit: request OTP for email change ────────────────────────────────
  const handleInitiateEmail = async () => {
    if (!newEmail.trim()) { toast.error("Enter a new email."); return; }

    setEmailLoading(true);
    const toastId = toast.loading("Sending OTP...");
    try {
      await initiateEmailChange(newEmail.trim());
      setOtpSent(true);
      toast.success("OTP sent to your new email!", { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP", { id: toastId });
    } finally {
      setEmailLoading(false);
    }
  };

  // ─── Submit: verify OTP ───────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otp.trim()) { toast.error("Enter the OTP."); return; }

    setOtpLoading(true);
    const toastId = toast.loading("Verifying OTP...");
    try {
      const res = await verifyEmailChange(otp.trim());
      setUser(res.data.data);                        // update global user context
      toast.success("Email updated successfully!", { id: toastId });
      setOtpSent(false);
      setNewEmail("");
      setOtp("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Verification failed", { id: toastId });
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
      <div className="max-w-xl mx-auto flex flex-col gap-8">

        {/* Page Header */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-400 hover:text-white text-sm mb-4 transition"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-zinc-400 text-sm mt-1">Update your profile information</p>
        </div>

        {/* ── SECTION 1: Name & Username ───────────────────────────────── */}
        <div className="bg-zinc-900 rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="text-base font-semibold text-white">Profile Details</h2>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white
                         placeholder:text-zinc-500 outline-none focus:ring-2
                         focus:ring-zinc-600 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Username</label>
            <div className="flex items-center bg-zinc-800 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-zinc-600 transition">
              <span className="text-zinc-500 text-sm mr-1">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="your_username"
                className="bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none w-full"
              />
            </div>
          </div>

          <button
            onClick={handleProfileSubmit}
            disabled={profileLoading}
            className={`self-end px-6 py-2.5 rounded-xl bg-white text-black text-sm
                       font-semibold hover:bg-zinc-200 transition disabled:opacity-50
                       disabled:cursor-not-allowed cursor-pointer ${profileLoading ? 'cursor-not-allowed': null}`}
          >
            {profileLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* ── SECTION 2: Email (2-step OTP flow) ───────────────────────── */}
        <div className="bg-zinc-900 rounded-2xl p-6 flex flex-col gap-5">
          <div>
            <h2 className="text-base font-semibold text-white">Change Email</h2>
            <p className="text-xs text-zinc-500 mt-1">
              Current: <span className="text-zinc-300">{user?.email}</span>
            </p>
          </div>

          {!otpSent ? (
            /* Step 1 — enter new email */
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-zinc-400">New Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new@email.com"
                  className="bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white
                             placeholder:text-zinc-500 outline-none focus:ring-2
                             focus:ring-zinc-600 transition"
                />
              </div>
              <button
                onClick={handleInitiateEmail}
                disabled={emailLoading}
                className={`self-end px-6 py-2.5 rounded-xl bg-white text-black text-sm
                           font-semibold hover:bg-zinc-200 transition disabled:opacity-50
                           disabled:cursor-not-allowed cursor-pointer ${emailLoading ? 'cursor-not-allowed': null}`}
              >
                {emailLoading ? "Sending..." : "Send OTP"}
              </button>
            </>
          ) : (
            /* Step 2 — enter OTP */
            <>
              <p className="text-sm text-zinc-400">
                An OTP was sent to <span className="text-white font-medium">{newEmail}</span>.
                Check your inbox and enter it below.
              </p>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-zinc-400">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  maxLength={6}
                  className="bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white
                             placeholder:text-zinc-500 outline-none focus:ring-2
                             focus:ring-zinc-600 transition tracking-widest"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => { setOtpSent(false); setOtp(""); }}
                  className="text-sm text-zinc-500 hover:text-white transition"
                >
                  ← Change email
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={otpLoading}
                  className={`px-6 py-2.5 rounded-xl bg-white text-black text-sm
                             font-semibold hover:bg-zinc-200 transition disabled:opacity-50
                             disabled:cursor-not-allowed cursor-pointer ${otpLoading ? 'cursor-not-allowed': null}`}
                >
                  {otpLoading ? "Verifying..." : "Verify & Update"}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}