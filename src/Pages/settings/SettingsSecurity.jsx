import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LoginContext } from "../../context/LoginContextProvider";
import { logoutAllDevices } from "../../services/userApi";
import api from "../../services/axios";
import { KeyRound, LogOut, Monitor, Eye, EyeOff } from "lucide-react";

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

function Card({ title, description, children }) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-6 flex flex-col gap-5">
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
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputCls} pr-10`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition cursor-pointer"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
        <h1 className="text-2xl font-bold text-white">Security</h1>
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
        <div className="flex items-center gap-4 py-3 border border-zinc-800 rounded-xl px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 shrink-0">
            <Monitor className="h-5 w-5 text-violet-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm text-white font-medium">Current Session</span>
            <span className="text-xs text-zinc-500">This device — Active now</span>
          </div>
          <span className="ml-auto text-xs bg-violet-600/20 text-violet-400 px-2 py-1 rounded-lg font-medium shrink-0">
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 shrink-0 mt-0.5">
            <LogOut className="h-5 w-5 text-orange-400" />
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <p className="text-sm text-zinc-400">
              All active sessions on all devices will be invalidated. You will be redirected to login.
            </p>
            <button
              onClick={handleLogoutAll}
              disabled={logoutLoading}
              className="self-start px-6 py-2.5 rounded-xl bg-orange-600 text-white text-sm
                         font-semibold hover:bg-orange-500 transition disabled:opacity-50
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