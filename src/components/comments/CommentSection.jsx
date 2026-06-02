import { useState, useContext } from "react";
import { LoginContext } from "../../context/LoginContextProvider";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getVideoComments } from "../../services/commentApi";
import {CommentForm} from "./CommentForm";
import {CommentList} from "./CommentList";

export function CommentSection({ videoId }) {
  const { user } = useContext(LoginContext);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);

  // TOGGLE + FETCH COMMENTS
  const handleToggle = async () => {

    // If already open — just close, don't refetch
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    // Open Comment Section
    setIsOpen(true);

    // Already fetched hai to dobara fetch mat karo
    if (isFetched) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getVideoComments(videoId);
      const fetchedComments = response?.data?.data || [];

      setComments(fetchedComments);
      setIsFetched(true);

    } catch (error) {
      console.log(error);
      setError(
        error?.response?.data?.message ||
        "Failed to fetch comments."
      );
    } finally {
      setLoading(false);
    }
  };

  // ADD COMMENT LOCALLY
  const handleCommentAdd = (newComment) => {
    if (!newComment) return;
    const commentWithOwner = {
      ...newComment,
      owner: {
        _id: user?._id,
        fullName: user?.fullName,
        username: user?.username,
        avatar: user?.avatar,
      }
    };

    setComments((prev) => [commentWithOwner, ...prev]);
  };

  // DELETE COMMENT LOCALLY
  const handleCommentDelete = (commentId) => {
    setComments((prev) =>
      prev.filter((comment) => comment._id !== commentId)
    );
  };

  // UPDATE COMMENT LOCALLY
  const handleCommentUpdate = (updatedComment) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
  };

  return (
    <section className="mt-6 border-t border-zinc-800 pt-6">

      {/* HEADER BUTTON */}
      <button
        onClick={handleToggle}
        className="
          flex items-center gap-2
          text-base font-semibold text-white
          hover:text-zinc-300 transition
          cursor-pointer
        "
      >
        {isOpen ? (
          <>
            <ChevronUp className="h-5 w-5" />
            <span>Comments ({comments.length})</span>
          </>
        ) : (
          <>
            <ChevronDown className="h-5 w-5" />
            <span>Show Comments</span>
          </>
        )}
      </button>

      {/* OPEN STATE */}
      {isOpen && (
        <div className="mt-5 space-y-6">

          {/* COMMENT FORM */}
          <CommentForm
            videoId={videoId}
            onCommentAdd={handleCommentAdd}
          />

          {/* LOADING SKELETONS */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 animate-pulse flex shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 rounded bg-zinc-800 animate-pulse" />
                    <div className="h-3 w-full rounded bg-zinc-800 animate-pulse" />
                    <div className="h-3 w-2/3 rounded bg-zinc-800 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR */}
          {error && !loading && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* COMMENT LIST */}
          {!loading && !error && (
            <CommentList
              comments={comments}
              onDelete={handleCommentDelete}
              onUpdate={handleCommentUpdate}
            />
          )}

        </div>
      )}

    </section>
  );
}
