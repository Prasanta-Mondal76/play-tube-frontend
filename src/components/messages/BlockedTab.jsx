import { useState, useEffect } from "react";
import { ShieldOff, ShieldCheck } from "lucide-react";
import { getBlockedUsers, unblockUser } from "../../services/messageApi";

export function BlockedTab() {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      const res = await getBlockedUsers();
      setBlockedUsers(res.data.blocks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      setActionLoadingId(userId);
      await unblockUser(userId);
      setBlockedUsers((prev) =>
        prev.filter((b) => b.blocked._id !== userId)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (blockedUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500">
        <ShieldCheck size={48} />
        <p className="text-lg">No blocked users</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {blockedUsers.map((block) => (
        <div
          key={block._id}
          className="flex items-center gap-4 bg-zinc-800 rounded-xl p-4"
        >
          {/* Avatar */}
          <img
            src={block.blocked.avatar}
            alt={block.blocked.fullName}
            className="w-11 h-11 rounded-full object-cover shrink-0 opacity-60"
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">
              {block.blocked.fullName}
            </p>
            <p className="text-sm text-gray-400">
              @{block.blocked.username}
            </p>
            <p className="text-xs text-red-400 mt-0.5">
              Blocked on {new Date(block.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Unblock button */}
          <button
            onClick={() => handleUnblock(block.blocked._id)}
            disabled={actionLoadingId === block.blocked._id}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-colors bg-zinc-700 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShieldOff size={14} />
            {actionLoadingId === block.blocked._id ? "Unblocking..." : "Unblock"}
          </button>
        </div>
      ))}
    </div>
  );
}