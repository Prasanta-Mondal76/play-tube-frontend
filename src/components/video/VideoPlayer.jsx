import { useState } from "react";

export function VideoPlayer({
  video
}) {

  const [isLoading, setIsLoading] =
    useState(true);

  if (!video) return null;

  const {
    videoFile,
    thumbnail,
    title
  } = video;

  return (

    <div
      className="
            relative
            w-full
            overflow-hidden
            rounded-2xl
            bg-black
         "
    >

      {/* Loading Overlay */}

      {
        isLoading && (

          <div
            className="
                     absolute
                     inset-0
                     z-10
                     flex
                     items-center
                     justify-center
                     bg-black
                     text-white
                  "
          >

            Loading Video...

          </div>

        )
      }

      <video
        controls
        autoPlay
        playsInline
        preload="metadata"
        controlsList="nodownload"
        poster={thumbnail}
        title={title}
        onLoadedData={() =>
          setIsLoading(false)
        }
        className="
               w-full
               aspect-video
               bg-black
            "
      >

        <source
          src={videoFile}
          type="video/mp4"
        />

        Your browser does not support
        video playback.

      </video>

    </div>

  );

}