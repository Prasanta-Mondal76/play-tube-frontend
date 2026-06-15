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

  if (loading) return <p className="text-white p-8">Searching...</p>;
  if (error)   return <p className="text-red-400 p-8">{error}</p>;
  if (!videos.length) return <p className="text-zinc-400 p-8">No results for "{query}"</p>;

  return (
    <div className="p-6">
      <h2 className="text-white text-xl mb-4">Results for "{query}"</h2>
      <VideoGrid videos={videos} />
    </div>
  );
}