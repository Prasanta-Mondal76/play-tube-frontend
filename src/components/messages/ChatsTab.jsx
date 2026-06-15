import { useState, useEffect, useContext } from "react";
import { MessageCircle, ArrowLeft, Search, X } from "lucide-react";
import { getMyConversations } from "../../services/messageApi.js";
import { ChatList } from "./ChatList.jsx";
import { ChatWindow } from "./ChatWindow.jsx";
import { useSocket } from "../../context/SocketContextProvider.jsx";
import { LoginContext } from "../../context/LoginContextProvider.jsx";

export function ChatsTab() {
  const { socket } = useSocket();
  const { user } = useContext(LoginContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c._id === message.conversationId
            ? {
                ...c,
                lastMessage: message.text,
                lastMessageAt: message.createdAt,
                unreadCount:
                  activeConversation?._id === message.conversationId
                    ? c.unreadCount
                    : (c.unreadCount || 0) + 1,
              }
            : c
        );
        return updated.sort(
          (a, b) =>
            new Date(b.lastMessageAt || b.updatedAt) -
            new Date(a.lastMessageAt || a.updatedAt)
        );
      });
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, activeConversation?._id]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await getMyConversations();
      setConversations(res.data.conversations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (conversationId, text) => {
    setConversations((prev) => {
      const now = new Date();
      const updated = prev.map((c) =>
        c._id === conversationId
          ? { ...c, lastMessage: text, lastMessageAt: now }
          : c
      );
      return updated.sort(
        (a, b) =>
          new Date(b.lastMessageAt || b.updatedAt) -
          new Date(a.lastMessageAt || a.updatedAt)
      );
    });
  };

  const handleSeen = (conversationId) => {
    setConversations((prev) =>
      prev.map((c) =>
        c._id === conversationId ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  const handleBlocked = (conversationId) => {
    setConversations((prev) => prev.filter((c) => c._id !== conversationId));
    setActiveConversation(null);
  };

  const handleChatCleared = (conversationId) => {
    setConversations((prev) =>
      prev.map((c) =>
        c._id === conversationId
          ? { ...c, lastMessage: "", lastMessageAt: null, unreadCount: 0 }
          : c
      )
    );
  };

  // Filter conversations by the other participant's name/username
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const other =
      conv.sender._id === user._id ? conv.receiver : conv.sender;
    const q = searchQuery.toLowerCase();
    return (
      other.fullName?.toLowerCase().includes(q) ||
      other.username?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500">
        <MessageCircle size={48} />
        <p className="text-lg">No chats yet</p>
        <p className="text-sm">Accept or send a chat request to start</p>
      </div>
    );
  }

  return (
    // On mobile: full height, single column. On md+: side-by-side.
    <div className="flex h-[calc(100vh-220px)] min-h-100 md:h-150">

      {/* 
        Conversation list:
        - Mobile: full width, hidden when a conversation is active
        - md+: fixed 280px sidebar, always visible
      */}
      <div
        className={`
          flex-col gap-2 overflow-y-auto
          w-full md:w-72 md:shrink-0 md:pr-2 md:mr-2 md:border-r md:border-zinc-700
          ${activeConversation ? "hidden md:flex" : "flex"}
        `}
      >
        {/* Search bar */}
        <div className="relative flex shrink-0 p-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-zinc-800 text-white rounded-lg pl-9 pr-9 py-2 text-sm outline-none focus:ring-1 focus:ring-zinc-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* List / empty search state */}
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 text-gray-500 text-sm py-10">
            <Search size={32} />
            <p>No chats match "{searchQuery}"</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <ChatList
              key={conv._id}
              conversation={conv}
              isActive={activeConversation?._id === conv._id}
              onClick={() => {
                setActiveConversation(conv);
                if ((conv.unreadCount || 0) > 0) handleSeen(conv._id);
              }}
            />
          ))
        )}
      </div>

      {/*
        Chat window:
        - Mobile: full width, only shown when a conversation is active
        - md+: fills remaining space, shown with placeholder when nothing selected
      */}
      <div
        className={`
          flex-col flex-1 bg-zinc-800 rounded-xl overflow-hidden
          ${activeConversation ? "flex" : "hidden md:flex"}
        `}
      >
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            onNewMessage={handleNewMessage}
            onBlocked={handleBlocked}
            onSeen={handleSeen}
            onChatCleared={handleChatCleared}
            // Pass back handler so ChatWindow can render a back button on mobile
            onBack={() => setActiveConversation(null)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
            <MessageCircle size={40} />
            <p>Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}