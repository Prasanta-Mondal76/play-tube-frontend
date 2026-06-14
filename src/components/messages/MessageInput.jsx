import { useState } from "react";
import { Send } from "lucide-react";
import { sendMessage } from "../../services/messageApi";

export function MessageInput({ conversationId, onSent }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    try {
      setSending(true);
      const res = await sendMessage(conversationId, text.trim());
      setText("");
      onSent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-3 px-4 py-3 border-t border-zinc-700">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Type a message..."
        className="flex-1 bg-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || sending}
        className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        <Send size={18} />
      </button>
    </div>
  );
}