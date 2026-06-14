import { useState, useEffect } from "react";
import { Check, X, Clock, Inbox } from "lucide-react";
import {
  getReceivedChatRequests,
  acceptChatRequest,
  rejectChatRequest,
} from "../../services/messageApi";

export function RequestsTab() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getReceivedChatRequests();
      setRequests(res.data.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      await acceptChatRequest(requestId);
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      await rejectChatRequest(requestId);
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
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

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500">
        <Inbox size={48} />
        <p className="text-lg">No pending requests</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {requests.map((request) => (
        <div
          key={request._id}
          className="flex items-start gap-4 bg-zinc-800 rounded-xl p-4"
        >
          {/* Avatar */}
          <img
            src={request.sender.avatar}
            alt={request.sender.fullName}
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white">
              {request.sender.fullName}
            </p>
            <p className="text-sm text-gray-400 mb-2">
              @{request.sender.username}
            </p>

            {request.reason && (
              <div className="bg-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-300">
                <span className="text-gray-500 text-xs block mb-1">Reason</span>
                {request.reason}
              </div>
            )}

            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Clock size={12} />
              {new Date(request.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => handleAccept(request._id)}
              disabled={actionLoadingId === request._id}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <Check size={14} />
              Accept
            </button>
            <button
              onClick={() => handleReject(request._id)}
              disabled={actionLoadingId === request._id}
              className="flex items-center gap-1 bg-zinc-700 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <X size={14} />
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}