import { useState, useEffect, useContext } from "react";
import { Send, Users, CheckCircle, Clock, XCircle } from "lucide-react";
import { getUserSubscriptions } from "../../services/subscriptionApi";
import { getChatConnectionStatus, sendChatRequest } from "../../services/messageApi";
import { LoginContext } from "../../context/LoginContextProvider";

export function ConnectionsTab() {
  const { user } = useContext(LoginContext);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [reason, setReason] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await getUserSubscriptions(user._id);

      const channels = res.data.data.subscriptions
      const withStatus = await Promise.all(
        channels.map(async (sub) => {
          const channel = sub.channel; 
          try {
            const statusRes = await getChatConnectionStatus(channel._id);
            return { ...channel, chatStatus: statusRes.data };
          } catch {
            return { ...channel, chatStatus: { status: "none" } };
          }
        })
      );
      setSubscriptions(withStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (channel) => {
    setSelectedChannel(channel);
    setReason("");
    setSendError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedChannel(null);
  };

  const handleSendRequest = async () => {
    if (!reason.trim()) {
      setSendError("Please write a reason.");
      return;
    }
    try {
      setSending(true);
      setSendError("");
      await sendChatRequest(selectedChannel._id, reason.trim());
      // Update status locally
      setSubscriptions((prev) =>
        prev.map((s) =>
          s._id === selectedChannel._id
            ? { ...s, chatStatus: { status: "pending" } }
            : s
        )
      );
      closeModal();
    } catch (err) {
      setSendError(err.response?.data?.message || "Failed to send request.");
    } finally {
      setSending(false);
    }
  };

  const StatusBadge = ({ status }) => {
    if (status === "accepted")
      return (
        <span className="flex items-center gap-1 text-xs text-green-400">
          <CheckCircle size={12} /> Connected
        </span>
      );
    if (status === "pending")
      return (
        <span className="flex items-center gap-1 text-xs text-yellow-400">
          <Clock size={12} /> Pending
        </span>
      );
    if (status === "rejected")
      return (
        <span className="flex items-center gap-1 text-xs text-red-400">
          <XCircle size={12} /> Rejected
        </span>
      );
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500">
        <Users size={48} />
        <p className="text-lg">No subscriptions yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {subscriptions.map((channel) => {
          const status = channel.chatStatus?.status ?? "none";
          const isConnected = status === "accepted";
          const isPending = status === "pending";

          return (
            <div
              key={channel._id}
              className="flex items-center gap-4 bg-zinc-800 rounded-xl p-4"
            >
              {/* Avatar */}
              <img
                src={channel.avatar}
                alt={channel.fullName}
                className="w-11 h-11 rounded-full object-cover shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">
                  {channel.fullName}
                </p>
                <p className="text-sm text-gray-400">@{channel.username}</p>
                <StatusBadge status={status} />
              </div>

              {/* Action */}
              {!isConnected && (
                <button
                  onClick={() => openModal(channel)}
                  disabled={isPending}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                    bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send size={14} />
                  {isPending ? "Requested" : status === "rejected" ? "Re-send" : "Send Request"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Send Request Modal */}
      {modalOpen && selectedChannel && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={closeModal}
        >
          <div
            className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-5">
              <img
                src={selectedChannel.avatar}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-white">
                  {selectedChannel.fullName}
                </p>
                <p className="text-sm text-gray-400">
                  @{selectedChannel.username}
                </p>
              </div>
            </div>

            <label className="block text-sm text-gray-400 mb-2">
              Why do you want to chat?
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Write a reason..."
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {reason.length}/500
            </div>

            {sendError && (
              <p className="text-red-400 text-sm mt-2">{sendError}</p>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={closeModal}
                className="flex-1 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white text-sm cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={sending}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm cursor-pointer transition-colors disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}