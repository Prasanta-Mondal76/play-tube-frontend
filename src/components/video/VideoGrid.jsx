import { useState, useEffect } from "react";
import { VideoCard } from "./VideoCard";
import { getAllVideos } from "../../services/videoApi";

export function VideoGrid() {

  const [videos, setVideos] = useState([]);

  useEffect(() => {

    getAllVideos()
      .then((response) => {

        setVideos(response.data.data.videos);

      })
      .catch((error) => {
        console.error(
          "Request failed for '/api/v1/videos/all-videos'",
          error
        );
      });
  }, []);
  
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