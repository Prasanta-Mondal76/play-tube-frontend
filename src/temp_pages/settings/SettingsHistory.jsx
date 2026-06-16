import { useState, useContext } from "react";
import toast from "react-hot-toast";
import { LoginContext } from "../../context/LoginContextProvider.jsx";
import { clearWatchHistory, togglePauseHistory } from "../../services/historyApi.js";
import { Trash2, PauseCircle, PlayCircle, Search } from "lucide-react";

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

// Confirmation modal
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
        <p className="text-sm text-zinc-300">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export function SettingsHistory() {
  const { user, setUser } = useContext(LoginContext);

  // ── Clear Watch History ──────────────────────────────────
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearLoading, setClearLoading]         = useState(false);

  const handleClearHistory = async () => {
    setClearLoading(true);
    setShowClearConfirm(false);
    const tid = toast.loading("Clearing watch history...");
    try {
      await clearWatchHistory();
      toast.success("Watch history cleared.", { id: tid });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to clear history", { id: tid });
    } finally { setClearLoading(false); }
  };

  // ── Pause Watch History ──────────────────────────────────
  const [pauseLoading, setPauseLoading] = useState(false);
  const isPaused = user?.watchHistoryPaused || false;

  const handleTogglePause = async () => {
    setPauseLoading(true);
    const tid = toast.loading(isPaused ? "Resuming history..." : "Pausing history...");
    try {
      const res = await togglePauseHistory();
      // Update local user context with new paused state
      setUser((prev) => ({
        ...prev,
        watchHistoryPaused: res.data.data.paused,
      }));
      toast.success(res.data.message, { id: tid });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to toggle", { id: tid });
    } finally { setPauseLoading(false); }
  };

  return (
    <>
      {showClearConfirm && (
        <ConfirmModal
          message="Are you sure you want to clear your entire watch history? This cannot be undone."
          onConfirm={handleClearHistory}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}

      <div className="px-4 py-8 max-w-2xl mx-auto flex flex-col gap-6">

        <div>
          <h1 className="text-2xl font-bold text-white">History & Activity</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Control your watch history and activity tracking.
          </p>
        </div>

        {/* ── Pause Watch History ─────────────────────────── */}
        <Card
          title="Pause Watch History"
          description="When paused, videos you watch won't be saved to your history."
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 shrink-0">
                {isPaused
                  ? <PauseCircle className="h-5 w-5 text-yellow-400" />
                  : <PlayCircle  className="h-5 w-5 text-green-400" />
                }
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-white font-medium">
                  {isPaused ? "History is Paused" : "History is Active"}
                </span>
                <span className="text-xs text-zinc-500">
                  {isPaused
                    ? "New videos are not being recorded."
                    : "New videos are being recorded."}
                </span>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              onClick={handleTogglePause}
              disabled={pauseLoading}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
                          border-2 border-transparent transition-colors duration-200 ease-in-out
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${isPaused ? "bg-zinc-700" : "bg-violet-600"}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow
                            transition duration-200 ease-in-out
                            ${isPaused ? "translate-x-0" : "translate-x-5"}`}
              />
            </button>
          </div>
        </Card>

        {/* ── Clear Watch History ─────────────────────────── */}
        <Card
          title="Clear Watch History"
          description="Permanently delete all videos from your watch history."
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 shrink-0 mt-0.5">
              <Trash2 className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <p className="text-sm text-zinc-400">
                This will permanently remove all videos from your watch history.
                This action cannot be undone.
              </p>
              <button
                onClick={() => setShowClearConfirm(true)}
                disabled={clearLoading}
                className="self-start px-6 py-2.5 rounded-xl bg-red-600/20 border border-red-600/40
                           text-red-400 text-sm font-semibold hover:bg-red-600/30 transition
                           disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {clearLoading ? "Clearing..." : "Clear All History"}
              </button>
            </div>
          </div>
        </Card>

        {/* ── Search History ──────────────────────────────── */}
        <Card
          title="Search History"
          description="Search history feature is coming soon."
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 shrink-0">
              <Search className="h-5 w-5 text-zinc-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-white font-medium">Search History</span>
              <span className="text-xs text-zinc-500">
                This feature isn't implemented yet. Your searches are not being tracked.
              </span>
            </div>
            <span className="ml-auto text-xs bg-zinc-800 text-zinc-500 px-2 py-1 rounded-lg font-medium shrink-0">
              Coming Soon
            </span>
          </div>
        </Card>

      </div>
    </>
  );
}