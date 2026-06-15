import {CommentCard} from "./CommentCard.jsx";

export function CommentList({ comments }) {

  if (!comments.length) {
    return (
      <p className="text-sm text-zinc-500">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentCard
          key={comment._id}
          comment={comment}
        />
      ))}
    </div>
  );
}
