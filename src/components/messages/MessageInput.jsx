import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { sendMessage } from "../../services/messageApi.js";

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
    <div className="flex items-end gap-2.5 px-3 sm:px-4 py-3 border-t border-white/5 bg-night-900/80 backdrop-blur-md shrink-0">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Type a message..."
        className="flex-1 bg-night-800 border border-line text-white rounded-[1.4rem] px-4 py-2.5 text-sm resize-none outline-none placeholder:text-zinc-500 focus:border-ember focus:ring-2 focus:ring-ember/20 focus:bg-night-850 transition max-h-32"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || sending}
        aria-label="Send message"
        className="group h-10 w-10 flex items-center justify-center ember-gradient shadow-lg shadow-ember/30 hover:brightness-110 hover:scale-105 rounded-full text-white transition-all cursor-pointer disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed shrink-0 active:scale-95"
      >
        {sending
          ? <Loader2 size={18} className="animate-spin" />
          : <Send size={18} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        }
      </button>
    </div>
  );
}