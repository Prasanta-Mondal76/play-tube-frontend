import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Tids } from "../utils/toastId";

import { ProfileHeader } from "../components/user/ProfileHeader";
import { ProfileTabs } from "../components/user/ProfileTabs";
import { VideoCard } from "../components/video/VideoCard";

import { getChannelDetails } from "../services/userApi";
import { getChannelVideos } from "../services/videoApi";

export function Profile() {
  const { username } = useParams();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("Videos");
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const toastId = "Profile-Toast-Id"


  // =========================
  // FETCH CHANNEL VIDEOS
  // =========================

  const fetchVideos = useCallback(async (channelId, cursor = null) => {
    try {
      if (cursor) {
        setLoadingMore(true);
      } else {
        setVideosLoading(true);
      }

      const params = { limit: 12 };
      if (cursor) {
        params.lastValue = cursor.lastValue;
        params.lastId = cursor.lastId;
      }

      const response = await getChannelVideos(channelId, params);
      const { videos: newVideos, nextCursor: newCursor } = response.data.data;

      setVideos((prev) => (cursor ? [...prev, ...(newVideos || [])] : (newVideos || [])));
      setNextCursor(newCursor);
      setHasMore(!!newCursor);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to load videos", {id: toastId});
    } finally {
      setVideosLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // =========================
  // FETCH CHANNEL DETAILS
  // =========================

  useEffect(() => {
    if (!username) return;
    fetchChannel();
  }, [username]);

  const fetchChannel = async () => {
    try {
      setLoading(true);
      toast.loading("Profile Loading...", {id: toastId})

      const response = await getChannelDetails(username);
      const channelData = response.data.data;

      setChannel(channelData);

      // Fetch videos using channel's _id
      await fetchVideos(channelData._id);
      toast.success("Profile Loaded", {id: toastId})
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to load channel.", {id: toastId});
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD MORE (triggered by sentinel)
  // =========================

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || !nextCursor || !channel?._id) return;
    fetchVideos(channel._id, nextCursor);
  }, [loadingMore, hasMore, nextCursor, channel?._id, fetchVideos]);

  // =========================
  // INTERSECTION OBSERVER
  // =========================

  useEffect(() => {
    if (activeTab !== "Videos" || !hasMore) return;

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
  }, [activeTab, hasMore, loadMore]);


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6 text-white">
        Loading...
      </div>
    );
  }
  if (!channel) {
    return null;
  }


  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-10 py-6 max-w-7xl mx-auto">

      {/* HEADER — Cover + Avatar + Info + Buttons */}
      <ProfileHeader channel={channel} setChannel={setChannel} />

      {/* TABS */}
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* TAB CONTENT */}
      <div className="mt-6">

        {/* ── VIDEOS TAB ── */}
        {activeTab === "Videos" && (
          <>
            {videosLoading ? (
              // Skeleton
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-video rounded-2xl bg-zinc-800 animate-pulse" />
                    <div className="h-4 w-3/4 rounded bg-zinc-800 animate-pulse" />
                    <div className="h-3 w-1/2 rounded bg-zinc-800 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : videos.length === 0 ? (
              <p className="text-zinc-500 text-sm">No videos yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <VideoCard
                    key={video._id}
                    videoId={video._id}
                    thumbnail={video.thumbnail}
                    title={video.title}
                    views={video.views}
                    published={video.createdAt}
                    duration={video.duration}
                    owner={channel}
                  />
                ))}
              </div>
            )}

            {/* Sentinel for infinite scroll */}
            {!videosLoading && hasMore && (
              <div ref={sentinelRef} className="h-10 w-full" />
            )}

            {loadingMore && (
              <p className="text-zinc-500 text-sm text-center py-4">Loading more videos...</p>
            )}
          </>
        )}

        {/* ── ABOUT TAB ── */}
        {activeTab === "About" && (
          <div className="max-w-2xl space-y-5 rounded-2xl bg-zinc-900 p-6">

            {/* DESCRIPTION */}
            {channel.description && (
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-1">
                  Channel About
                </h3>
                <p className="text-zinc-200 text-sm whitespace-pre-line leading-relaxed">
                  {channel.description}
                </p>
              </div>
            )}

            {/* SUBSCRIBERS */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-400 mb-1">
                Total Subscribers
              </h3>
              <p className="text-white text-sm">
                {channel.totalSubscribers?.toLocaleString() || 0}
              </p>
            </div>

            {/* TOTAL VIEWS */}
            {channel.totalViews !== undefined && (
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-1">
                  Total Views
                </h3>
                <p className="text-white text-sm">
                  {channel.totalViews?.toLocaleString() || 0}
                </p>
              </div>
            )}

            {/* SOCIAL LINKS */}
            {channel.socialLinks && Object.keys(channel.socialLinks).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-2">
                  Social Media Links
                </h3>
                <div className="flex flex-col gap-1.5">
                  {Object.entries(channel.socialLinks).map(([platform, url]) =>
                    url ? (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:underline capitalize"
                      >
                        {platform}: {url}
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}