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

          <div className="fixed inset-0 flex items-center justify-center bg-zinc-900">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
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
               aspect-[16/7.5]
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