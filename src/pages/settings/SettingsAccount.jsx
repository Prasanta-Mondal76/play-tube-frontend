import { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { LoginContext } from "../../context/LoginContextProvider.jsx";
import { updateUserData, initiateEmailChange, verifyEmailChange } from "../../services/userApi.js";
import { User, Mail, AtSign, Calendar } from "lucide-react";

// ── Reusable input style ──────────────────────────────────────
const inputCls = `
  w-full bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white
  placeholder:text-zinc-500 outline-none focus:ring-2
  focus:ring-violet-600/60 transition
`;

const btnCls = `
  self-end px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm
  font-semibold hover:bg-violet-500 transition disabled:opacity-50
  disabled:cursor-not-allowed cursor-pointer
`;

// ── Info row (read-only display) ──────────────────────────────
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-zinc-800/60 last:border-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 shrink-0">
        <Icon className="h-4 w-4 text-violet-400" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-zinc-500 font-medium">{label}</span>
        <span className="text-sm text-white truncate">{value || "—"}</span>
      </div>
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────
function Card({ title, description, children }) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {description && (
          <p className="text-xs text-zinc-500 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function SettingsAccount() {
  const { user, setUser } = useContext(LoginContext);

  // ── Name & Username ──────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setUsername(user.username || "");
    }
  }, [user]);

  const handleProfileSubmit = async () => {
    const payload = {};
    if (fullName !== user?.fullName) payload.fullName = fullName;
    if (username !== user?.username) payload.username = username;
    if (!Object.keys(payload).length) { toast.error("No changes detected."); return; }

    setProfileLoading(true);
    const tid = toast.loading("Saving changes...");
    try {
      const res = await updateUserData(payload);
      setUser(res.data.data);
      toast.success("Profile updated!", { id: tid });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed", { id: tid });
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Email change (2-step OTP) ────────────────────────────
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const handleInitiateEmail = async () => {
    if (!newEmail.trim()) { toast.error("Enter a new email."); return; }
    setEmailLoading(true);
    const tid = toast.loading("Sending OTP...");
    try {
      await initiateEmailChange(newEmail.trim());
      setOtpSent(true);
      toast.success("OTP sent to your new email!", { id: tid });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP", { id: tid });
    } finally { setEmailLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) { toast.error("Enter the OTP."); return; }
    setOtpLoading(true);
    const tid = toast.loading("Verifying OTP...");
    try {
      const res = await verifyEmailChange(otp.trim());
      setUser(res.data.data);
      toast.success("Email updated successfully!", { id: tid });
      setOtpSent(false); setNewEmail(""); setOtp("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Verification failed", { id: tid });
    } finally { setOtpLoading(false); }
  };

  // ── Joined date ──────────────────────────────────────────
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    })
    : "—";

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto flex flex-col gap-6">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Account</h1>
        <p className="text-zinc-400 text-sm mt-1">
          View and manage your account information.
        </p>
      </div>

      {/* ── Read-only info ─────────────────────────────────── */}
      <Card title="Account Info" description="Your current account details.">
        <InfoRow icon={User} label="Full Name" value={user?.fullName} />
        <InfoRow icon={Mail} label="Email" value={user?.email} />
        <InfoRow icon={AtSign} label="Username" value={`@${user?.username}`} />
        <InfoRow icon={Calendar} label="Joined" value={joinedDate} />
      </Card>

      {/* ── Change name / username ─────────────────────────── */}
      <Card
        title="Change Name or Username"
        description="Update how your name and handle appear across PlayTube."
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className={inputCls}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Username</label>
          <div className="flex items-center bg-zinc-800 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-violet-600/60 transition">
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

        <button onClick={handleProfileSubmit} disabled={profileLoading} className={btnCls}>
          {profileLoading ? "Saving..." : "Save Changes"}
        </button>
      </Card>

      {/* ── Change email ───────────────────────────────────── */}
      <Card
        title="Change Email"
        description={`Current email: ${user?.email || "—"}`}
      >
        {!otpSent ? (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">New Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new@email.com"
                className={inputCls}
              />
            </div>
            <button onClick={handleInitiateEmail} disabled={emailLoading} className={btnCls}>
              {emailLoading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-zinc-400">
              OTP sent to{" "}
              <span className="text-white font-medium">{newEmail}</span>.
              Check your inbox.
            </p>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                maxLength={6}
                className={`${inputCls} tracking-widest`}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => { setOtpSent(false); setOtp(""); }}
                className="text-sm text-zinc-500 hover:text-white transition"
              >
                ← Change email
              </button>
              <button onClick={handleVerifyOtp} disabled={otpLoading} className={btnCls}>
                {otpLoading ? "Verifying..." : "Verify & Update"}
              </button>
            </div>
          </>
        )}
      </Card>

    </div>
  );
}