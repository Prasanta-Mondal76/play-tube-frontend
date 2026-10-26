import { useState, useEffect, useRef, useContext } from "react";
import { MoreVertical, ShieldOff, Trash2, ArrowLeft, Check, CheckCheck } from "lucide-react";
import { LoginContext } from "../../context/LoginContextProvider.jsx";
import {
  getConversationMessages,
  markMessagesAsSeen,
  blockUser,
  clearChat,
} from "../../services/messageApi.js";
import { MessageInput } from "./MessageInput.jsx";
import { useSocket } from "../../context/SocketContextProvider.jsx";

export function ChatWindow({ conversation, onNewMessage, onBlocked, onSeen, onChatCleared, onBack }) {
  const { user } = useContext(LoginContext);
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const bottomRef = useRef(null);
  const menuRef = useRef(null);

  const other =
    conversation.sender._id === user._id
      ? conversation.receiver
      : conversation.sender;

  useEffect(() => {
    fetchMessages();
  }, [conversation._id]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message.conversationId === conversation._id) {
        setMessages((prev) => [...prev, message]);
        markMessagesAsSeen(conversation._id)
          .then(() => onSeen?.(conversation._id))
          .catch(() => {});
      }
    };

    const handleMessagesSeen = ({ conversationId }) => {
      if (conversationId === conversation._id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender._id === user._id ? { ...msg, isSeen: true } : msg
          )
        );
      }
    };

    const handleChatCleared = ({ conversationId }) => {
      if (conversationId === conversation._id) {
        setMessages([]);
        onChatCleared?.(conversation._id);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", handleMessagesSeen);
    socket.on("chatCleared", handleChatCleared);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen", handleMessagesSeen);
      socket.off("chatCleared", handleChatCleared);
    };
  }, [socket, conversation._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getConversationMessages(conversation._id);
      setMessages(res.data.messages);
      await markMessagesAsSeen(conversation._id);
      onSeen?.(conversation._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSent = (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
    onNewMessage(conversation._id, newMessage.text);
  };

  const handleBlock = async () => {
    try {
      setBlocking(true);
      await blockUser(other._id);
      setShowBlockConfirm(false);
      onBlocked?.(conversation._id);
    } catch (err) {
      console.error(err);
    } finally {
      setBlocking(false);
    }
  };

  const handleClearChat = async () => {
    try {
      setClearing(true);
      await clearChat(conversation._id);
      setMessages([]);
      setShowClearConfirm(false);
      onChatCleared?.(conversation._id);
    } catch (err) {
      console.error(err);
    } finally {
      setClearing(false);
    }
  };

  const lastSentIndex = messages.reduce(
    (last, msg, i) => (msg.sender._id === user._id ? i : last),
    -1
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-ember/25 border-t-ember rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/5 shrink-0 bg-night-900/70 backdrop-blur-md">

        {/* Back button — only visible on mobile */}
        <button
          onClick={onBack}
          className="md:hidden p-1.5 rounded-lg hover:bg-night-700 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft size={18} />
        </button>

        <img
          src={other.avatar}
          className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-ember/40"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">{other.fullName}</p>
          <p className="text-xs text-gray-400 truncate">@{other.username}</p>
        </div>

        {/* Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-night-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 bg-night-850 border border-white/10 rounded-xl shadow-xl w-48 z-10 overflow-hidden animate-scale-in">
              <button
                onClick={() => { setMenuOpen(false); setShowClearConfirm(true); }}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-300 hover:bg-night-700 transition-colors cursor-pointer"
              >
                <Trash2 size={15} />
                Clear chat
              </button>
              <div className="border-t border-white/5" />
              <button
                onClick={() => { setMenuOpen(false); setShowBlockConfirm(true); }}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-night-700 transition-colors cursor-pointer"
              >
                <ShieldOff size={15} />
                Block {other.fullName}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-4 py-4 flex flex-col gap-2.5">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMine = msg.sender._id === user._id;
            const isLastSent = index === lastSentIndex;

            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMine ? "items-end" : "items-start"} animate-fade-up`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] px-3.5 py-2.5 text-sm leading-relaxed break-words ${
                    isMine
                      ? "ember-gradient shadow-lg shadow-ember/25 text-white rounded-[1.15rem] rounded-br-md"
                      : "bg-night-700 border border-white/5 text-zinc-100 rounded-[1.15rem] rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="mt-1 px-1 flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMine && isLastSent && (
                    msg.isSeen
                      ? <span className="flex items-center gap-1 font-semibold text-ember-soft"><CheckCheck size={13} /> Seen</span>
                      : <span className="flex items-center gap-1"><Check size={13} /> Sent</span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput conversationId={conversation._id} onSent={handleSent} />

      {/* Clear Chat Confirm Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="bg-night-800 border border-white/10 rounded-3xl p-6 w-full max-w-sm animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-night-700 mb-4 mx-auto">
              <Trash2 size={22} className="text-gray-300" />
            </div>
            <p className="text-white font-semibold text-center mb-1">Clear this chat?</p>
            <p className="text-sm text-gray-400 text-center mb-6">
              All messages will be permanently deleted for both you and{" "}
              <span className="text-white">{other.fullName}</span>. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-full bg-night-700 hover:bg-night-600 text-white text-sm cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearChat}
                disabled={clearing}
                className="flex-1 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm cursor-pointer transition-colors disabled:opacity-50"
              >
                {clearing ? "Clearing..." : "Clear chat"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirm Modal */}
      {showBlockConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setShowBlockConfirm(false)}
        >
          <div
            className="bg-night-800 border border-white/10 rounded-3xl p-6 w-full max-w-sm animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <img src={other.avatar} className="w-10 h-10 rounded-full object-cover opacity-60" />
              <div>
                <p className="font-semibold text-white">{other.fullName}</p>
                <p className="text-sm text-gray-400">@{other.username}</p>
              </div>
            </div>
            <p className="text-white font-semibold mb-1">Block this user?</p>
            <p className="text-sm text-gray-400 mb-6">
              They won't be able to send you chat requests or messages. You can unblock them anytime from the Blocked tab.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBlockConfirm(false)}
                className="flex-1 py-2 rounded-full bg-night-700 hover:bg-night-600 text-white text-sm cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBlock}
                disabled={blocking}
                className="flex-1 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm cursor-pointer transition-colors disabled:opacity-50"
              >
                {blocking ? "Blocking..." : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}