import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getHistory } from "../services/historyApi.js";
import { Loader2, HistoryIcon, Home } from "lucide-react";
import { Tids } from "../utils/index.js";
import { LoginContext } from "../context/LoginContextProvider.jsx";

export function History() {
  const { isLogIn } = useContext(LoginContext);
  const navigate = useNavigate(); // ✅ Fixed: was Navigate() (component), now useNavigate() (hook)

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(30);

  const fetchHistory = async (days = 30) => {
    try {
      setLoading(true);
      setActiveFilter(days);
      const res = await getHistory(days);
      setHistory(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch history", { id: Tids.error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(30);
  }, []);

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!isLogIn) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-5 px-4 text-white">
        <HistoryIcon size={56} className="text-gray-500" />
        <h2 className="text-2xl font-bold text-center">
          Sign in to see your watch history
        </h2>
        <p className="text-gray-400 text-center text-sm max-w-xs">
          Keep track of what you've been watching by logging into your account.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mt-2 bg-white text-black font-semibold px-6 py-2.5 rounded-full hover:bg-gray-200 transition-colors duration-200"
        >
          <Home size={16} />
          Back to Home
        </button>
      </div>
    );
  }

  // ── Logged in ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 sm:px-6 md:px-8 py-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <HistoryIcon size={28} className="shrink-0" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            Watch History
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Recently watched videos
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 sm:gap-3 mb-8 flex-wrap">
        {[7, 30, 60].map((days) => (
          <button
            key={days}
            onClick={() => fetchHistory(days)}
            disabled={loading}
            className={`
              px-4 sm:px-5 py-2 rounded-full
              transition-all duration-200 cursor-pointer
              text-sm font-medium
              disabled:opacity-50 disabled:cursor-not-allowed
              ${activeFilter === days
                ? "bg-blue-600 text-white hover:bg-blue-900"
                : "bg-[#272727] hover:bg-[#3a3a3a] text-white"
              }
            `}
          >
            Last {days} Days
          </button>
        ))}
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center py-24">
          <Loader2 size={40} className="animate-spin text-gray-400" />
        </div>
      )}

      {/* Empty State */}
      {!loading && history.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="bg-[#1a1a1a] rounded-full p-6 mb-5">
            <HistoryIcon size={48} className="text-gray-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
            No watch history found
          </h2>
          <p className="text-gray-400 text-sm max-w-sm">
            Videos you watch in the last {activeFilter} days will appear here.
            Try a longer time range or start watching something!
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 flex items-center gap-2 bg-[#272727] hover:bg-[#3a3a3a] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors duration-200"
          >
            <Home size={15} />
            Browse Videos
          </button>
        </div>
      )}

      {/* History Grid */}
      {!loading && history.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {history.map((item) => {
            const video = item.video;
            if (!video) return null;

            return (
              <div
                key={item._id}
                onClick={() => navigate(`/watch/${video._id}`)}
                className="bg-[#181818] rounded-xl overflow-hidden hover:bg-[#222] transition-all duration-200 cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-2 py-0.5 rounded font-medium">
                    {video.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={video.owner?.avatar}
                      alt={video.owner?.username}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-semibold line-clamp-2 mb-1 leading-snug">
                        {video.title}
                      </h2>
                      <p className="text-xs text-gray-400 truncate">
                        {video.owner?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {video.views?.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
