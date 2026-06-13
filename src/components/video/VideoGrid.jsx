import { useState, useEffect } from "react";
import { VideoCard } from "./VideoCard";
import { getAllVideos } from "../../services/videoApi";
import toast from "react-hot-toast"
import { Tids } from "../../utils/toastId";

export function VideoGrid({ videos: propVideos }) {

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(!propVideos);
  const toastId = "home-video-fetch"

  useEffect(() => {
    if (propVideos) {
      setVideos(propVideos);
      return;
    }

    setLoading(true);
    getAllVideos()
      .then((response) => {
        setVideos(response.data.data.videos);
      })
      .catch((error) => {
        console.error("Request failed...", error)
        toast.error("Failed to load videos", { id: Tids.error })
      })
      .finally(() => {
        setLoading(false)
      });
  }, [propVideos]);

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

    </div>
  );
}