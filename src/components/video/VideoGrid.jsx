import { useState, useEffect, useRef, useCallback } from "react";
import { VideoCard } from "./VideoCard";
import { getAllVideos } from "../../services/videoApi";
import toast from "react-hot-toast"
import { Tids } from "../../utils/toastId";

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
    return <div className="p-5 text-zinc-400 text-2xl font-bold text-center pt-10">Loading...</div>
  }

  return (

    <div className="bg-black min-h-screen p-4">

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
        <div className="text-zinc-400 text-center py-4">Loading more...</div>
      )}

    </div>
  );
}