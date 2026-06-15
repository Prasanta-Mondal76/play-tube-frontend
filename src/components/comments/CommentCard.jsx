import { useState, useContext } from "react";
import { ThumbsUp } from "lucide-react";
import { toggleCommentLike } from "../../services/likeApi.js";
import { LoginContext } from "../../context/LoginContextProvider.jsx";
import { BoxContext } from "../../context/BoxContextProvider.jsx";

export function CommentCard({ comment }) {

  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likes, setLikes] = useState(comment.likes || 0);
  const [likeLoading, setLikeLoading] = useState(false);

  const {isLogIn} = useContext(LoginContext)
  const {isLoginBoxOpen, setIsLoginBoxOpen} = useContext(BoxContext)

  // LIKE COMMENT
  const handleLike = async () => {
    if (likeLoading) return;

    if(!isLogIn) setIsLoginBoxOpen(true)

    const previousLiked = isLiked;
    const previousLikes = likes;

    try {
      setLikeLoading(true);

      // Optimistic update
      setIsLiked((prev) => !prev);
      setLikes((prev) => isLiked ? prev - 1 : prev + 1);

      await toggleCommentLike(comment._id);

    } catch (error) {
      console.log(error);
      // Rollback
      setIsLiked(previousLiked);
      setLikes(previousLikes);
    } finally {
      setTimeout(() => setLikeLoading(false), 1000);
    }
  };

  return (
    <div className="flex gap-3">

      {/* AVATAR */}
      <img
        src={comment.owner?.avatar}
        alt={comment.owner?.fullName}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      />

      {/* RIGHT SIDE */}
      <div className="flex-1">

        {/* NAME + USERNAME */}
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-white">
            {comment.owner?.fullName}
          </h4>
          <span className="text-xs text-zinc-500">
            @{comment.owner?.username}
          </span>
        </div>

        {/* COMMENT TEXT */}
        <p className="mt-1 text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
          {comment.content}
        </p>

        {/* LIKE BUTTON */}
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`
            mt-2 flex items-center gap-1.5
            text-sm transition
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
            ${isLiked ? "text-white" : "text-zinc-500 hover:text-zinc-300"}
          `}
        >
          <ThumbsUp className={`h-4 w-4 ${isLiked ? "fill-white" : ""}`} />
          <span>{likes}</span>
        </button>

      </div>

    </div>
  );
}
