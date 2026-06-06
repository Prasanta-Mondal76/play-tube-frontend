import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, Home, Loader2, UserMinus, UserPlus } from "lucide-react";
import { LoginContext } from "../context/LoginContextProvider";
import { getUserSubscriptions, toggleSubscription } from "../services/subscriptionApi";
import { Tids } from "../utils";

export function Subscriptions() {
  const { isLogIn, user } = useContext(LoginContext);
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null); // channelId being toggled

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await getUserSubscriptions(user._id);
      setSubscriptions(res.data.data.subscriptions);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to fetch subscriptions",
        { id: Tids.error }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLogIn && user?._id) fetchSubscriptions();
    else setLoading(false);
  }, [isLogIn, user]);

  const handleToggle = async (channelId) => {
    if (togglingId) return;
    setTogglingId(channelId);
    try {
      await toggleSubscription(channelId);
      // Optimistically remove from list (unsubscribed)
      setSubscriptions((prev) =>
        prev.filter((s) => s.channel._id !== channelId)
      );
      toast.success("Unsubscribed", { id: Tids.success });
    } catch (err) {
      toast.error("Failed to unsubscribe", { id: Tids.error });
    } finally {
      setTogglingId(null);
    }
  };

  // ── Not logged in ────────────────────────────────────────────────────────
  if (!isLogIn) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-5 px-4 text-white">
        <Users size={56} className="text-gray-500" />
        <h2 className="text-2xl font-bold text-center">Sign in to see your subscriptions</h2>
        <p className="text-gray-400 text-center text-sm max-w-xs">
          Channels you subscribe to will appear here.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded-full hover:bg-gray-200 transition-colors duration-200"
        >
          <Home size={16} /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto bg-transparent text-white px-4 sm:px-6 md:px-8 py-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Users size={28} className="shrink-0" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Subscriptions</h1>
          <p className="text-gray-400 text-sm mt-0.5">Channels you follow</p>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center py-24">
          <Loader2 size={40} className="animate-spin text-gray-400" />
        </div>
      )}

      {/* Empty State */}
      {!loading && subscriptions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="bg-[#1a1a1a] rounded-full p-6 mb-5">
            <Users size={48} className="text-gray-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">No subscriptions yet</h2>
          <p className="text-gray-400 text-sm max-w-sm">
            Channels you subscribe to will show up here. Go explore some videos!
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 flex items-center gap-2 bg-[#272727] hover:bg-[#3a3a3a] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors duration-200"
          >
            <Home size={15} /> Browse Videos
          </button>
        </div>
      )}

      {/* Subscription List */}
      {!loading && subscriptions.length > 0 && (
        <div className="flex flex-col gap-3 ">

          {/* Count */}
          <p className="text-sm text-gray-500 mb-2">
            {subscriptions.length} channel{subscriptions.length !== 1 ? "s" : ""}
          </p>

          {subscriptions.map(({ channel }) => {
            if (!channel) return null;
            const isToggling = togglingId === channel._id;

            return (
              <div
                key={channel._id}
                className="flex items-center gap-4 bg-[#181818] hover:bg-[#1f1f1f] transition-colors duration-200 rounded-2xl px-4 py-3.5 group"
              >
                {/* Avatar — clickable to profile */}
                <img
                  src={channel.avatar}
                  alt={channel.username}
                  onClick={() => navigate(`/profile/${channel.username}`)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0 cursor-pointer ring-2 ring-transparent group-hover:ring-violet-500/40 transition-all duration-200"
                />

                {/* Info */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => navigate(`/profile/${channel.username}`)}
                >
                  <p className="font-semibold text-sm sm:text-base truncate text-white">
                    {channel.fullName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">@{channel.username}</p>
                  {channel.videosCount !== undefined && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {channel.videosCount} video{channel.videosCount !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                {/* Unsubscribe Button */}
                <button
                  onClick={() => handleToggle(channel._id)}
                  disabled={isToggling}
                  className={`
                    flex items-center gap-1.5 shrink-0
                    text-xs sm:text-sm font-medium
                    px-3 sm:px-4 py-2 rounded-full
                    border transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    border-zinc-700 text-gray-300
                    hover:border-red-500/60 hover:text-red-400 hover:bg-red-500/10
                  `}
                >
                  {isToggling
                    ? <Loader2 size={14} className="animate-spin" />
                    : <UserMinus size={14} />
                  }
                  <span className="hidden sm:inline">
                    {isToggling ? "Unsubscribing…" : "Unsubscribe"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
