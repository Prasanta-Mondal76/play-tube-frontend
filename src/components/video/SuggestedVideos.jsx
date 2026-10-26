import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Tids } from "../../utils/toastId.js";

import { getAllVideos } from "../../services/videoApi.js";
import { VideoCard } from "./VideoCard.jsx";

export function SuggestedVideos({
   currentVideoId
}) {

   const [videos, setVideos] = useState([]);

   const [loading, setLoading] = useState(true);

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
            toast.error( error?.response?.data?.message || "Failed to load videos", {id: Tids.error});
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

         <div className="flex flex-col gap-4">

            <h3 className="text-base font-bold text-white">Up Next</h3>

            {[1, 2, 3, 4, 5].map((i) => (
               <div key={i}>
                  <div className="skeleton-wave aspect-video w-full rounded-2xl bg-night-800" />
                  <div className="mt-3 flex gap-3">
                     <div className="skeleton-wave h-9 w-9 shrink-0 rounded-full bg-night-800" />
                     <div className="flex-1">
                        <div className="skeleton-wave h-3.5 w-11/12 rounded bg-night-800" />
                        <div className="skeleton-wave mt-2 h-3 w-3/5 rounded bg-night-800" />
                     </div>
                  </div>
               </div>
            ))}

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

         <h3 className="text-base font-bold text-white">Up Next</h3>

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