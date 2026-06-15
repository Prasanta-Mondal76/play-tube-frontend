import { useEffect, useState } from "react";
import { getAllVideos } from "../../../services/dashboardApi.js";
import { togglePublishStatus } from "../../../services/videoApi.js";
import { MoreVertical, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { UpdateVideo } from "../dashMethods/UpdateVideo.jsx";
import { DeleteVideoConfirm } from "../dashMethods/DeleteVideoConfirm.jsx";

const FILTERS = ["All", "Published", "Unpublished"];

export function ChannelVideoSection({ isOwner = true }) {
  const [videos, setVideos] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);

  // Which modals are open and for which video
  const [updateVideo, setUpdateVideo] = useState(null);   // video object
  const [deleteVideo, setDeleteVideo] = useState(null);   // video object

  useEffect(() => {
    async function fetchVideos() {
      try {
        const result = await getAllVideos();
        setVideos(result.data.data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    }
    fetchVideos();
  }, []);

  const filtered = videos.filter((v) => {
    if (activeFilter === "Published") return v.isPublished;
    if (activeFilter === "Unpublished") return !v.isPublished;
    return true;
  });

  // Toggle publish — optimistic update
  const handleTogglePublish = async (video) => {
    setOpenMenu(null);
    const toastId = toast.loading(
      video.isPublished ? "Unpublishing..." : "Publishing..."
    );
    // Optimistic
    setVideos((prev) =>
      prev.map((v) =>
        v._id === video._id ? { ...v, isPublished: !v.isPublished } : v
      )
    );
    try {
      await togglePublishStatus(video._id);
      toast.success(
        video.isPublished ? "Video unpublished." : "Video published.",
        { id: toastId }
      );
    } catch (err) {
      // Rollback
      setVideos((prev) =>
        prev.map((v) =>
          v._id === video._id ? { ...v, isPublished: video.isPublished } : v
        )
      );
      toast.error(err?.response?.data?.message || "Failed", { id: toastId });
    }
  };

  return (
    <>
      <div
        className="w-full rounded-2xl p-4 sm:p-6 bg-[#0f0f10] border border-zinc-800"
        onClick={() => setOpenMenu(null)}
      >
        {/* Filters */}
        <div className="flex flex-row gap-2 sm:gap-3">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={(e) => { e.stopPropagation(); setActiveFilter(filter); }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide
                transition-all duration-200 cursor-pointer
                ${activeFilter === filter
                  ? "bg-blue-600 text-white border border-zinc-500 shadow-lg"
                  : "bg-[#18181b] text-zinc-300 border border-zinc-700 hover:bg-zinc-800"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Video List */}
        <div className="flex flex-col gap-3 pt-3">
          {filtered.length === 0 && (
            <p className="text-center py-10 text-sm text-zinc-500">
              No videos in this category.
            </p>
          )}

          {filtered.map((video) => (
            <div
              key={video._id}
              className="flex items-center gap-3 sm:gap-4 rounded-xl px-3 py-2.5 relative
                bg-[#1a1a1d] border border-zinc-700 hover:border-zinc-500
                hover:bg-[#232326] transition-all duration-150"
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 rounded-lg overflow-hidden w-[clamp(72px,14vw,120px)] aspect-video border border-zinc-600">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title + Badge */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm sm:text-base font-medium text-zinc-100">
                  {video.title}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                    ${video.isPublished
                      ? "bg-[#30306a] text-white border border-zinc-600"
                      : "bg-[#623333] text-red-300 border border-red-900"
                    }`}
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
                <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setOpenMenu(openMenu === video._id ? null : video._id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                      border border-zinc-700 text-zinc-300 hover:bg-zinc-900
                      hover:border-zinc-500 cursor-pointer transition-all"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openMenu === video._id && (
                    <div className="absolute right-0 top-10 z-50 min-w-[150px] rounded-xl
                      overflow-hidden flex flex-col bg-[#18181b] border border-zinc-700 shadow-2xl">

                      <button
                        type="button"
                        onClick={() => { setUpdateVideo(video); setOpenMenu(null); }}
                        className="flex gap-2.5 items-center px-4 py-2.5 text-sm
                          text-emerald-200 hover:bg-zinc-800 cursor-pointer transition"
                      >
                        <Pencil size={14} /> Update
                      </button>

                      <div className="h-px bg-zinc-800" />

                      <button
                        type="button"
                        onClick={() => handleTogglePublish(video)}
                        className="flex gap-2.5 items-center px-4 py-2.5 text-sm
                          text-blue-300 hover:bg-zinc-800 cursor-pointer transition"
                      >
                        {video.isPublished
                          ? <><EyeOff size={14} /> Unpublish</>
                          : <><Eye size={14} /> Publish</>
                        }
                      </button>

                      <div className="h-px bg-zinc-800" />

                      <button
                        type="button"
                        onClick={() => { setDeleteVideo(video); setOpenMenu(null); }}
                        className="flex gap-2.5 items-center px-4 py-2.5 text-sm
                          text-red-300 hover:bg-zinc-800 cursor-pointer transition"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {updateVideo && (
        <UpdateVideo
          video={updateVideo}
          onClose={() => setUpdateVideo(null)}
          setVideos={setVideos}
        />
      )}

      {deleteVideo && (
        <DeleteVideoConfirm
          video={deleteVideo}
          onClose={() => setDeleteVideo(null)}
          setVideos={setVideos}
        />
      )}
    </>
  );
}