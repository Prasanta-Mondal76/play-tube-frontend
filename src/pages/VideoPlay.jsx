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
      <div className="p-5">
        Loading...
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

