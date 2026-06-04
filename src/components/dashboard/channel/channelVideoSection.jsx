import { useEffect, useState } from "react";
import { getAllVideos } from "../../../services/dashboardApi";
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
const FILTERS = ["All", "Published", "Unpublished"];

export function ChannelVideoSection({ isOwner = true }) {
  const [mockVideos, setMockVideos] = useState([])
  const [activeFilter, setActiveFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const result = await getAllVideos();
        setMockVideos(result.data.data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    }

    fetchVideos();
  }, []);

  const filtered = mockVideos.filter((v) => {
    if (activeFilter === "Published") return v.isPublished;
    if (activeFilter === "Unpublished") return !v.isPublished;
    return true;
  });

  const handleMenuToggle = (id) => {
    setOpenMenu((prev) => (prev === id ? null : id));
  };

  const handleAction = (action, videoId) => {
    alert(`${action} video #${videoId}`);
    setOpenMenu(null);
  };

  return (
    <div
      className="
        w-full rounded-2xl p-4 sm:p-6
        bg-[#0f0f10] border border-zinc-800
      "
      onClick={() => setOpenMenu(null)}
    >
      {/* Filters */}
      <div className="flex flex-row gap-2 sm:gap-3">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={(e) => {
              e.stopPropagation();
              setActiveFilter(filter);
            }}
            className={`
              px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide
              transition-all duration-200 focus:outline-none cursor-pointer
              ${activeFilter === filter
                ? "bg-white text-black border border-white shadow-lg"
                : "bg-[#18181b] text-zinc-300 border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-500"
              }
            `}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Video List */}
      <div className="flex flex-col gap-3 pt-3">
        {filtered.length === 0 && (
          <p className="text-center py-10 text-sm text-[#4ade80B3]">
            No videos in this category.
          </p>
        )}

        {filtered.map((video) => (
          <div
            key={video._id}
            className="
              flex items-center gap-3 sm:gap-4
              rounded-xl px-3 py-2.5 relative
              transition-all duration-150 group
              bg-[#1a1a1d]
              border border-zinc-700
              hover:border-zinc-500
              hover:bg-[#232326] cursor-pointer
            "
          >
            {/* Thumbnail */}
            <div
              className="
                flex-shrink-0 rounded-lg overflow-hidden
                w-[clamp(72px,14vw,120px)]
                aspect-video
                border border-zinc-600
              "
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title + Badge */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm sm:text-base font-medium leading-snug text-zinc-100">
                {video.title}
              </p>

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className={`
                    text-xs px-2 py-0.5 rounded-full font-semibold tracking-wide
                    ${video.isPublished
                      ? "bg-[#30306a] text-white border border-zinc-600"
                      : "bg-[#623333] text-red-300 border border-red-900"
                    }
                  `}
                >
                  {video.isPublished ? "Published" : "Unpublished"}
                </span>

                <span className="text-xs hidden sm:inline text-zinc-400">
                  {video.views} views · {video.duration}
                </span>
              </div>
            </div>

            {/* Three-dot menu */}
            {isOwner && (
              <div
                className="relative flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => handleMenuToggle(video._id)}
                  className={`
                    w-8 h-8 flex items-center justify-center
                    rounded-lg transition-all duration-150
                    focus:outline-none
                    border border-zinc-700
                  text-zinc-300 hover:bg-zinc-900 hover:border-zinc-500
                    cursor-pointer
                    ${openMenu === video._id
                      ? "bg-[#101a2233]"
                      : "bg-transparent"
                    }
                  `}
                  aria-label="Video options"
                >
                  <MoreVertical />

                </button>

                {/* Dropdown */}
                {openMenu === video._id && (
                  <div
                    className="
                      absolute right-0 top-10 z-50
                      min-w-[130px]
                      rounded-xl overflow-hidden flex flex-col
                      bg-[#18181b]
                      border border-zinc-700
                      shadow-2xl
                      
                    "
                  >
                    <button
                      onClick={() => handleAction("Update", video._id)}
                      className=" flex gap-2.5 justify-center content-center items-center
                        px-4 py-2.5 text-sm font-medium text-left
                        transition-all duration-100
                        focus:outline-none
                        text-emerald-200
                        hover:bg-[#32327fb5]
                        cursor-pointer
                      "
                    >
                      <Pencil  size={15}/> 
                      <h3>Update</h3>
                    </button>

                    <div className="h-px bg-[#1a4a33]" />

                    <button
                      onClick={() => handleAction("Delete", video._id)}
                      className="flex gap-2.5 justify-center content-center items-center
                        px-4 py-2.5 text-sm font-medium text-left
                        transition-all duration-100
                        focus:outline-none
                        text-red-300
                        hover:bg-[#32327fb5] cursor-pointer
                      "
                    >
                      <Trash2 size={15}/> 
                      <h3>Delete</h3>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}