import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchVideos } from "../services/videoApi.js";
import { VideoGrid } from "../components/video/VideoGrid.jsx"; 

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchVideos(query)
      .then((res) => setVideos(res.data.data.videos))
      .catch(() => setError("Something went wrong."))
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) return (
    <div className="p-6 bg-night-950 min-h-screen">
      <div className="fixed top-14 left-0 right-0 z-40 h-[3px] overflow-hidden">
        <div className="h-full w-full ember-gradient animate-topbar origin-left" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-video rounded-2xl skeleton-wave" />
            <div className="h-4 w-3/4 rounded skeleton-wave" />
            <div className="h-3 w-1/2 rounded skeleton-wave" />
          </div>
        ))}
      </div>
    </div>
  );
  if (error)   return <p className="text-red-400 p-8">{error}</p>;
  if (!videos.length) return <p className="text-zinc-400 p-8 bg-night-950 min-h-screen">No results for "{query}"</p>;

  return (
    <div className="p-6 bg-night-950 min-h-screen animate-fade-in">
      <h2 className="text-white text-xl font-bold mb-4">Results for <span className="ember-text">"{query}"</span></h2>
      <VideoGrid videos={videos} />
    </div>
  );
}