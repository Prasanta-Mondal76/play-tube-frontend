import { useState, useEffect, useRef, useCallback } from "react";
import { VideoCard } from "./VideoCard.jsx";
import { getAllVideos } from "../../services/videoApi.js";
import toast from "react-hot-toast"
import { Tids } from "../../utils/toastId.js";

export function VideoGrid({ videos: propVideos }) {

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(!propVideos);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  // =========================
  // FETCH PAGE (initial or next)
  // =========================
  const fetchVideos = useCallback(async (cursor = null) => {
    const params = { limit: 12 };

    if (cursor) {
      params.lastValue = cursor.lastValue;
      params.lastId = cursor.lastId;
    }

    const response = await getAllVideos(params);
    const { videos: newVideos, nextCursor: newCursor } = response.data.data;

    setVideos((prev) => (cursor ? [...prev, ...newVideos] : newVideos));
    setNextCursor(newCursor);
    setHasMore(!!newCursor);
  }, []);

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    if (propVideos) {
      setVideos(propVideos);
      setHasMore(false);
      return;
    }

    setLoading(true);
    fetchVideos(null)
      .catch((error) => {
        console.error("Request failed...", error)
        toast.error("Failed to load videos", { id: Tids.error })
      })
      .finally(() => {
        setLoading(false)
      });
  }, [propVideos, fetchVideos]);

  // =========================
  // LOAD MORE (triggered by sentinel)
  // =========================
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !nextCursor || propVideos) return;

    setLoadingMore(true);
    try {
      await fetchVideos(nextCursor);
    } catch (error) {
      console.error("Request failed...", error)
      toast.error("Failed to load more videos", { id: Tids.error })
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, nextCursor, propVideos, fetchVideos]);

  // =========================
  // INTERSECTION OBSERVER
  // =========================
  useEffect(() => {
    if (!hasMore || propVideos) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, propVideos, loadMore]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-night-950 p-4">
        {/* Top loading bar (YouTube style, ember gradient) */}
        <div className="fixed left-0 right-0 top-16 z-40 h-[3px] overflow-hidden bg-white/5">
          <div className="ember-gradient animate-topbar absolute top-0 h-full" />
        </div>

        {/* Wave skeleton cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton-wave aspect-video w-full rounded-2xl bg-night-800" />
              <div className="mt-3 flex gap-3">
                <div className="skeleton-wave h-10 w-10 shrink-0 rounded-full bg-night-800" />
                <div className="flex-1">
                  <div className="skeleton-wave h-3.5 w-11/12 rounded bg-night-800" />
                  <div className="skeleton-wave mt-2 h-3 w-3/5 rounded bg-night-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (

    <div className="bg-night-950 min-h-screen p-4">

      <div
        className="
          grid gap-6

          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            videoId={video._id}
            file={video.videoFile}
            thumbnail={video.thumbnail}
            avatar={video.avatar}
            title={video.title}
            channelName={video.username}
            views={video.views}
            published={video.createdAt}
            duration={video.duration}
            owner={video.owner}
          />
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      {hasMore && !propVideos && (
        <div ref={sentinelRef} className="h-10 w-full" />
      )}

      {loadingMore && (
        <div className="flex items-center justify-center gap-3 py-5 text-sm text-zinc-400">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-ember" />
          Loading more...
        </div>
      )}

    </div>
  );
}