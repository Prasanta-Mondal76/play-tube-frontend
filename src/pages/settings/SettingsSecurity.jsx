import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LoginContext } from "../../context/LoginContextProvider.jsx";
import { logoutAllDevices } from "../../services/userApi.js";
import api from "../../services/axios.js";
import { KeyRound, LogOut, Monitor, Eye, EyeOff } from "lucide-react";

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

// Password field with show/hide toggle
function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    // Password field + bahar side me attach eye button (approved design)
    <div className="flex items-stretch gap-2">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputCls} flex-1 min-w-0`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        aria-label={show ? "Hide password" : "Show password"}
        className="shrink-0 flex items-center justify-center px-3 rounded-xl bg-night-800 border border-line text-zinc-300 transition cursor-pointer hover:ember-gradient hover:text-white hover:border-transparent active:scale-95"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}

export function SettingsSecurity() {
  const { setUser, setIsLogIn } = useContext(LoginContext);
  const navigate = useNavigate();

  // ── Change Password ──────────────────────────────────────
  const [oldPass, setOldPass]         = useState("");
  const [newPass, setNewPass]         = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      toast.error("All fields are required."); return;
    }
    if (newPass !== confirmPass) {
      toast.error("New passwords do not match."); return;
    }
    setPassLoading(true);
    const tid = toast.loading("Updating password...");
    try {
      await api.post("/api/v1/users/change-password", {
        oldPassword: oldPass,
        newPassword: newPass,
      });
      toast.success("Password updated successfully!", { id: tid });
      setOldPass(""); setNewPass(""); setConfirmPass("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update password", { id: tid });
    } finally { setPassLoading(false); }
  };

  // ── Logout All Devices ───────────────────────────────────
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogoutAll = async () => {
    setLogoutLoading(true);
    const tid = toast.loading("Logging out all devices...");
    try {
      await logoutAllDevices();
      setUser(null);
      setIsLogIn(false);
      toast.success("Logged out from all devices.", { id: tid });
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to logout", { id: tid });
    } finally { setLogoutLoading(false); }
  };

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Security</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Manage your password and active sessions.
        </p>
      </div>

      {/* ── Change Password ───────────────────────────────── */}
      <Card
        title="Change Password"
        description="Use a strong password with uppercase, lowercase, numbers, and symbols."
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Current Password</label>
          <PasswordInput
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            placeholder="Current password"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">New Password</label>
          <PasswordInput
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="New password"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Confirm New Password</label>
          <PasswordInput
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>

        <button onClick={handleChangePassword} disabled={passLoading} className={btnCls}>
          {passLoading ? "Updating..." : "Update Password"}
        </button>
      </Card>

      {/* ── Device Sessions ───────────────────────────────── */}
      <Card
        title="Device Sessions"
        description="You are currently signed in on this device. Logging out all devices will require you to sign in again everywhere."
      >
        {/* Current session indicator */}
        <div className="flex items-center gap-4 py-3 border border-white/5 rounded-xl px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-night-800 shrink-0">
            <Monitor className="h-5 w-5 text-ember-soft" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm text-white font-medium">Current Session</span>
            <span className="text-xs text-zinc-500">This device — Active now</span>
          </div>
          <span className="ml-auto text-xs bg-ember/15 text-ember-soft px-2 py-1 rounded-lg font-medium shrink-0">
            Active
          </span>
        </div>

        <p className="text-xs text-zinc-600">
          Per-device session tracking is not yet implemented. Use "Logout All Devices" to invalidate all sessions.
        </p>
      </Card>

      {/* ── Logout All Devices ────────────────────────────── */}
      <Card
        title="Logout All Devices"
        description="This will sign you out from every device and browser where you are logged in."
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-night-800 shrink-0 mt-0.5">
            <LogOut className="h-5 w-5 text-orange-400" />
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <p className="text-sm text-zinc-400">
              All active sessions on all devices will be invalidated. You will be redirected to login.
            </p>
            <button
              onClick={handleLogoutAll}
              disabled={logoutLoading}
              className="self-start px-6 py-2.5 rounded-full bg-orange-600 text-white text-sm
                         font-semibold hover:bg-orange-500 active:scale-[0.98] transition disabled:opacity-50
                         disabled:cursor-not-allowed cursor-pointer"
            >
              {logoutLoading ? "Logging out..." : "Logout All Devices"}
            </button>
          </div>
        </div>
      </Card>

    </div>
  );
}