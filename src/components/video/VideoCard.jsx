import { useNavigate } from "react-router-dom";

export function VideoCard({
  videoId,
  file,
  thumbnail,
  avatar,
  title,
  channelName,
  views,
  published,
  duration,
  owner
}) {

  const navigate = useNavigate();

  // Publish Video Time Formating
  function timeAgo(seconds) {

    if (seconds < 60) {
      return `${Math.floor(seconds)} seconds ago`;
    }

    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute ago`;
    }

    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hours ago`;
    }

    if (seconds < 2592000) {
      const days = Math.floor(seconds / 86400);
      return `${days} days ago`;
    }

    if (seconds < 31536000) {
      const months = Math.floor(seconds / 2592000);
      return `${months} months ago`;
    }

    const years = Math.floor(seconds / 31536000);
    return `${years} years ago`;
  }
  const posted = (Date.now() - new Date(published)) / 1000
  published = timeAgo(posted)

  // Video Duration Formating
  function formatDuration(totalSeconds) {

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    // Add leading zero
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");

    // If video has hours
    if (hours > 0) {
      return `${hours}:${paddedMinutes}:${paddedSeconds}`;
    }

    return `${minutes}:${paddedSeconds}`;
  }
  duration = formatDuration(duration)

  // Video Views Formating
  function formatViews(views) {

    if (views < 1000) {
      return `${views}`;
    }

    if (views < 1000000) {
      return `${(views / 1000).toFixed(1)}K`;
    }

    if (views < 1000000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }

    return `${(views / 1000000000).toFixed(1)}B`;
  }
  views = formatViews(views)

  return (
    <div className="w-full cursor-pointer  
    border-transparent
    transition-all duration-300
    hover:bg-blue-800/20
    hover:border-blue-900 
    hover:rounded-xl
    p-1"

    onClick={() => navigate(`/watch/${videoId}`)}
    >

      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-zinc-800">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover"
        />

        {/* Duration */}
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {duration}
        </span>
      </div>

      {/* Video Info */}
      <div className="mt-3 flex gap-3">

        {/* Channel Avatar */}
        <img
          src={owner.avatar}
          alt={owner.username}
          className="h-10 w-10 rounded-full object-cover"
        />

        {/* Text Content */}
        <div className="flex-1">

          {/* Title */}
          <h3 className="line-clamp-2 text-sm font-semibold text-white">
            {title}
          </h3>

          {/* Channel Name */}
          <p className="mt-1 text-sm text-zinc-400">
            {owner.fullName}
          </p>

          {/* Views + Published */}
          <p className="text-sm text-zinc-400">
            {views} views • {published}
          </p>
        </div>
      </div>
    </div>
  );
}