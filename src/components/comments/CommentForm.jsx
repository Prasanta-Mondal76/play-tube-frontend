import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import { LoginContext } from "../../context/LoginContextProvider";
import { addComment } from "../../services/commentApi";

export function CommentForm({ videoId, onCommentAdd }) {

  const { setIsAuthOpen } = useContext(AuthContext);
  const { isLogIn } = useContext(LoginContext);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // SUBMIT COMMENT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogIn) {
      setIsAuthOpen(true);
      return;
    }

    if (!content.trim()) return;

    try {
      setLoading(true);

      // ✅ Pass object { content }, not plain string
      const response = await addComment(videoId, { content });

      const newComment = response?.data?.data;

      if (newComment) {
        onCommentAdd(newComment);
      }

      setContent("");

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isLogIn ? "Add a comment..." : "Login to comment..."}
        disabled={loading}
        className="
          w-full min-h-24
          rounded-xl
          bg-zinc-800
          border border-zinc-700
          focus:border-zinc-500
          p-3 outline-none resize-none
          text-sm text-white
          placeholder:text-zinc-500
          transition
          disabled:opacity-50
        "
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="
            px-5 py-2
            rounded-full
            bg-white text-black
            text-sm font-semibold
            hover:bg-zinc-200
            transition
            disabled:opacity-40
            cursor-pointer
            disabled:cursor-not-allowed

          "
        >
          {loading ? "Posting..." : "Comment"}
        </button>
      </div>

    </form>
  );
}
