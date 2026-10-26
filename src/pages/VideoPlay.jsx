import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Tids } from "../utils/toastId.js";

import { VideoPlayer } from "../components/video/VideoPlayer.jsx";
import { VideoInfo } from "../components/video/VideoInfo.jsx";
import { SuggestedVideos } from "../components/video/SuggestedVideos.jsx";
import { CommentSection } from "../components/comments/CommentSection.jsx";

import {
  getVideoById,
  recordVideoView,
} from "../services/videoApi.js";
import { updateHistory } from "../services/historyApi.js"
import { LoginContext } from "../context/LoginContextProvider.jsx";

export const VideoPlay = () => {
  const { videoId } = useParams();
  const {isLogIn} = useContext(LoginContext)

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoId) return

    fetchVideoPageData();
  }, [videoId]);

  const fetchVideoPageData = async () => {

    try {
      setLoading(true);

      const videoResponse = await getVideoById(videoId);

      setVideo(videoResponse.data.data);

      // Record video view separately
      await recordVideoView(videoId).catch((err) => { console.log("Could not record view. Error: ", err) });

      // Add vidoe to history
      if(isLogIn) await updateHistory(videoId)
    }

    catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message
        || "Failed to load video",
        { id: Tids.error }
      );
    }
    finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-3 py-5">
        {/* Top loading bar (YouTube style, ember gradient) */}
        <div className="fixed left-0 right-0 top-16 z-40 h-[3px] overflow-hidden bg-white/5">
          <div className="ember-gradient animate-topbar absolute top-0 h-full" />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          {/* Player + info skeleton */}
          <div className="w-full xl:w-[70%]">
            <div className="skeleton-wave aspect-[16/7.5] w-full rounded-2xl bg-night-800" />
            <div className="skeleton-wave mt-4 h-6 w-3/4 rounded bg-night-800" />
            <div className="mt-5 flex items-center gap-4">
              <div className="skeleton-wave h-12 w-12 shrink-0 rounded-full bg-night-800" />
              <div className="flex-1">
                <div className="skeleton-wave h-4 w-40 rounded bg-night-800" />
                <div className="skeleton-wave mt-2 h-3 w-24 rounded bg-night-800" />
              </div>
              <div className="skeleton-wave h-10 w-28 rounded-full bg-night-800" />
            </div>
          </div>

          {/* Suggested skeleton */}
          <div className="flex w-full flex-col gap-4 xl:w-[30%]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="skeleton-wave aspect-video w-40 shrink-0 rounded-xl bg-night-800" />
                <div className="flex-1">
                  <div className="skeleton-wave h-3.5 w-full rounded bg-night-800" />
                  <div className="skeleton-wave mt-2 h-3 w-2/3 rounded bg-night-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="px-3 py-5">
      <div className="flex flex-col xl:flex-row gap-6">

        {/* LEFT SECTION */}
        <div className="w-full xl:w-[70%]">

          <VideoPlayer
            video={video}
          />

          <VideoInfo
            video={video}
            setVideo={setVideo}
          />

          {/* COMMENT SECTION */}
          <CommentSection videoId={videoId} />

        </div>

        {/* RIGHT SECTION */}

        <div className="w-full xl:w-[30%]">

          <SuggestedVideos
            currentVideoId={videoId}
          />

        </div>

      </div>
    </div>
  );
};

