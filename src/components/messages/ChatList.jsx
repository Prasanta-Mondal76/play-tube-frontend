import { useContext } from "react";
import { LoginContext } from "../../context/LoginContextProvider";

export function ChatList({ conversation, isActive, onClick }) {
  const { user } = useContext(LoginContext);

  const other =
    conversation.sender._id === user._id
      ? conversation.receiver
      : conversation.sender;

  const lastMsgAt = conversation.lastMessageAt
    ? new Date(conversation.lastMessageAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const unreadCount = conversation.unreadCount || 0;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
        isActive ? "bg-blue-600" : "bg-zinc-700 hover:bg-zinc-600"
      }`}
    >
      <img
        src={other.avatar}
        alt={other.fullName}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium text-white text-sm truncate">
            {other.fullName}
          </p>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {lastMsgAt && (
              <span className="text-xs text-gray-400">{lastMsgAt}</span>
            )}
            {!isActive && unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        </div>
        <p
          className={`text-xs truncate ${
            !isActive && unreadCount > 0
              ? "text-white font-medium"
              : "text-gray-400"
          }`}
        >
          {conversation.lastMessage || "No messages yet"}
        </p>
      </div>
    </div>
  );
}