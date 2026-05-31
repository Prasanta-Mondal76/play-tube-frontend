import {
   useEffect,
   useState,
} from "react";

import {
   getAllVideos,
} from "../../services/videoApi";

import {
   VideoCard
} from "./VideoCard";

export function SuggestedVideos({
   currentVideoId
}) {

   const [videos, setVideos] =
      useState([]);

   const [loading, setLoading] =
      useState(true);

   const [error, setError] =
      useState(null);

   // =========================
   // FETCH VIDEOS
   // =========================

   useEffect(() => {

      fetchSuggestedVideos();

   }, [currentVideoId]);

   const fetchSuggestedVideos =
      async () => {

         try {

            setLoading(true);

            const response =
               await getAllVideos();

            // Remove current playing video

            const filteredVideos =
               response.data.data.videos
                  .filter(
                     (video) =>
                        video._id !==
                        currentVideoId
                  );

            setVideos(filteredVideos);

         }
         catch (error) {

            console.log(error);

            setError(
               error?.response?.data?.message
               || "Failed to load videos"
            );

         }
         finally {

            setLoading(false);

         }

      };

   // =========================
   // LOADING
   // =========================

   if (loading) {

      return (

         <div
            className="
               text-zinc-400
            "
         >

            Loading videos...

         </div>

      );

   }

   // =========================
   // ERROR
   // =========================

   if (error) {

      return (

         <div
            className="
               text-red-500
            "
         >

            {error}

         </div>

      );

   }

   return (

      <div
         className="
            flex
            flex-col
            gap-4
         "
      >

         {
            videos.map((video) => (

               <VideoCard

                  key={video._id}

                  videoId={video._id}

                  file={video.videoFile}

                  thumbnail={video.thumbnail}

                  avatar={video.owner?.avatar}

                  title={video.title}

                  channelName={
                     video.owner?.username
                  }

                  views={video.views}

                  published={video.createdAt}

                  duration={video.duration}

                  owner={video.owner}

               />

            ))
         }

      </div>

   );

}