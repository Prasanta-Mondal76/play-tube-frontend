import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, Home, Loader2, UserPlus } from "lucide-react";
import { LoginContext } from "../context/LoginContextProvider";
import { getChannelSubscribers } from "../services/subscriptionApi";
import { Tids } from "../utils";

export function Subscribers() {
  const { isLogIn, user } = useContext(LoginContext);
  const navigate = useNavigate();

  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);       // initial load
  const [loadingMore, setLoadingMore] = useState(false); // pagination load
  const [cursor, setCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Infinite scroll sentinel
  const sentinelRef = useRef(null);

  const fetchSubscribers = useCallback(async (nextCursor = null) => {
    if (!user?._id) return;

    nextCursor ? setLoadingMore(true) : setLoading(true);

    try {
      const res = await getChannelSubscribers(user._id, {
        cursor: nextCursor,
        limit: 20,
      });

      const { subscribers: newSubs, pagination } = res.data.data;

      setSubscribers((prev) =>
        nextCursor ? [...prev, ...newSubs] : newSubs
      );
      setCursor(pagination.nextCursor);
      setHasNextPage(pagination.hasNextPage);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to fetch subscribers",
        { id: Tids.error }
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    if (isLogIn && user?._id) fetchSubscribers();
    else setLoading(false);
  }, [isLogIn, user]);

  // Infinite scroll — observe sentinel div
  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !loadingMore) {
          fetchSubscribers(cursor);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, loadingMore, cursor, fetchSubscribers]);

  // ── Not logged in ────────────────────────────────────────────────────────
  if (!isLogIn) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-5 px-4 text-white">
        <Users size={56} className="text-gray-500" />
        <h2 className="text-2xl font-bold text-center">Sign in to see your subscribers</h2>
        <p className="text-gray-400 text-center text-sm max-w-xs">
          You need to be logged in to view who subscribes to your channel.
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
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 sm:px-6 md:px-8 py-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <UserPlus size={28} className="shrink-0" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Your Subscribers</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            People who subscribed to your channel
          </p>
        </div>
      </div>

      {/* Initial Loader */}
      {loading && (
        <div className="flex justify-center py-24">
          <Loader2 size={40} className="animate-spin text-gray-400" />
        </div>
      )}

      {/* Empty State */}
      {!loading && subscribers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="bg-[#1a1a1a] rounded-full p-6 mb-5">
            <Users size={48} className="text-gray-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">No subscribers yet</h2>
          <p className="text-gray-400 text-sm max-w-sm">
            When people subscribe to your channel, they'll show up here.
            Keep uploading great content!
          </p>
        </div>
      )}

      {/* Subscribers List */}
      {!loading && subscribers.length > 0 && (
        <div className="flex flex-col gap-3 max-w-3xl">

          {/* Count */}
          <p className="text-sm text-gray-500 mb-2">
            {subscribers.length}{hasNextPage ? "+" : ""} subscriber{subscribers.length !== 1 ? "s" : ""}
          </p>

          {subscribers.map(({ _id, subscriber }) => {
            if (!subscriber) return null;

            return (
              <div
                key={_id}
                className="flex items-center gap-4 bg-[#181818] hover:bg-[#1f1f1f] transition-colors duration-200 rounded-2xl px-4 py-3.5 group"
              >
                {/* Avatar */}
                <img
                  src={subscriber.avatar}
                  alt={subscriber.username}
                  onClick={() => navigate(`/profile/${subscriber.username}`)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0 cursor-pointer ring-2 ring-transparent group-hover:ring-violet-500/40 transition-all duration-200"
                />

                {/* Info */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => navigate(`/profile/${subscriber.username}`)}
                >
                  <p className="font-semibold text-sm sm:text-base truncate text-white">
                    {subscriber.fullName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    @{subscriber.username}
                  </p>
                </div>

                {/* View Profile */}
                <button
                  onClick={() => navigate(`/profile/${subscriber.username}`)}
                  className="shrink-0 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full border border-zinc-700 text-gray-300 hover:border-violet-500/60 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-200"
                >
                  <span className="hidden sm:inline">View Profile</span>
                  <span className="sm:hidden">View</span>
                </button>
              </div>
            );
          })}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="py-2 flex justify-center">
            {loadingMore && (
              <Loader2 size={28} className="animate-spin text-gray-500" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
