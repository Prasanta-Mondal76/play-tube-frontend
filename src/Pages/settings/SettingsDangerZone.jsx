import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LoginContext } from "../../context/LoginContextProvider";
import { clearWatchHistory } from "../../services/historyApi";
import api from "../../services/axios";
import { TriangleAlert, Trash2, History } from "lucide-react";

function Card({ title, description, children, border = "border-zinc-800" }) {
  return (
    <div className={`bg-zinc-900 rounded-2xl p-6 flex flex-col gap-5 border ${border}`}>
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {description && <p className="text-xs text-zinc-500 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}

// Confirmation modal with a type-to-confirm pattern for delete account
function ConfirmModal({ title, message, confirmLabel = "Confirm", onConfirm, onCancel, danger = false, requireTyping = null }) {
  const [typed, setTyped] = useState("");
  const canConfirm = requireTyping ? typed === requireTyping : true;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <TriangleAlert className={`h-5 w-5 shrink-0 ${danger ? "text-red-400" : "text-orange-400"}`} />
          <h3 className="text-base font-semibold text-white">{title}</h3>
        </div>

        <p className="text-sm text-zinc-400">{message}</p>

        {requireTyping && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500">
              Type <span className="text-white font-mono">{requireTyping}</span> to confirm
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={requireTyping}
              className="w-full bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white
                         placeholder:text-zinc-600 outline-none focus:ring-2
                         focus:ring-red-600/60 transition font-mono"
            />
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            className={`px-4 py-2 rounded-xl text-white text-sm font-semibold transition cursor-pointer
                        disabled:opacity-40 disabled:cursor-not-allowed
                        ${danger ? "bg-red-600 hover:bg-red-500" : "bg-orange-600 hover:bg-orange-500"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SettingsDangerZone() {
  const { user, setUser, setIsLogIn } = useContext(LoginContext);
  const navigate = useNavigate();

  // ── Remove All History ───────────────────────────────────
  const [showHistoryConfirm, setShowHistoryConfirm] = useState(false);
  const [historyLoading, setHistoryLoading]         = useState(false);

  const handleClearHistory = async () => {
    setHistoryLoading(true);
    setShowHistoryConfirm(false);
    const tid = toast.loading("Removing all history...");
    try {
      await clearWatchHistory();
      toast.success("All history removed.", { id: tid });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove history", { id: tid });
    } finally { setHistoryLoading(false); }
  };

  // ── Delete Account ───────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading]         = useState(false);

  const handleRequestDelete = async () => {
    setDeleteLoading(true);
    setShowDeleteConfirm(false);
    const tid = toast.loading("Sending deletion email...");
    try {
      await api.post("/api/v1/users/delete-account/request");
      toast.success(
        "Confirmation email sent. Check your inbox to confirm deletion.",
        { id: tid, duration: 6000 }
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to initiate deletion", { id: tid });
    } finally { setDeleteLoading(false); }
  };

  return (
    <>
      {showHistoryConfirm && (
        <ConfirmModal
          title="Remove All History"
          message="This will permanently delete your entire watch history. This action cannot be undone."
          confirmLabel="Remove All"
          onConfirm={handleClearHistory}
          onCancel={() => setShowHistoryConfirm(false)}
          danger={false}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete Account"
          message={`This will permanently delete your account, all your videos, playlists, comments, and data. A confirmation link will be sent to ${user?.email}. This cannot be undone.`}
          confirmLabel="Send Deletion Email"
          onConfirm={handleRequestDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          danger={true}
          requireTyping="DELETE"
        />
      )}

      <div className="px-4 py-8 max-w-2xl mx-auto flex flex-col gap-6">

        {/* Warning banner */}
        <div className="flex items-start gap-3 bg-red-950/30 border border-red-800/40 rounded-2xl px-5 py-4">
          <TriangleAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h1 className="text-lg font-bold text-red-400">Danger Zone</h1>
            <p className="text-xs text-red-400/70 mt-0.5">
              Actions here are irreversible. Please proceed with caution.
            </p>
          </div>
        </div>

        {/* ── Remove All History ──────────────────────────── */}
        <Card
          title="Remove All History"
          description="Permanently delete your entire watch history across all devices."
          border="border-zinc-800"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 shrink-0 mt-0.5">
              <History className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <p className="text-sm text-zinc-400">
                All watch history will be permanently deleted. This cannot be undone.
              </p>
              <button
                onClick={() => setShowHistoryConfirm(true)}
                disabled={historyLoading}
                className="self-start px-6 py-2.5 rounded-xl bg-orange-600/20 border border-orange-600/40
                           text-orange-400 text-sm font-semibold hover:bg-orange-600/30 transition
                           disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {historyLoading ? "Removing..." : "Remove All History"}
              </button>
            </div>
          </div>
        </Card>

        {/* ── Delete Account ──────────────────────────────── */}
        <Card
          title="Delete Account"
          description="Permanently delete your PlayTube account and all associated data."
          border="border-red-800/40"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-950/40 shrink-0 mt-0.5">
              <Trash2 className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <ul className="text-sm text-zinc-400 flex flex-col gap-1.5 list-none">
                {[
                  "Your account and profile will be deleted",
                  "All your uploaded videos will be removed",
                  "Your playlists and comments will be deleted",
                  "Your subscriptions will be removed",
                  "This action is permanent and cannot be reversed",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-xs text-zinc-600">
                A confirmation link will be sent to{" "}
                <span className="text-zinc-400">{user?.email}</span>. 
                Your account will only be deleted after you click that link.
              </p>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleteLoading}
                className="self-start px-6 py-2.5 rounded-xl bg-red-600 text-white text-sm
                           font-semibold hover:bg-red-500 transition disabled:opacity-50
                           disabled:cursor-not-allowed cursor-pointer"
              >
                {deleteLoading ? "Processing..." : "Delete My Account"}
              </button>
            </div>
          </div>
        </Card>

      </div>
    </>
  );
}