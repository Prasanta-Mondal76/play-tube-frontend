import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cancelDeleteAccount } from "../../services/userApi.js";
import toast from "react-hot-toast";

export function CancelDeleteAccount() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    
    const tid = toast.loading("Cancelling account deletion...");
    cancelDeleteAccount(token)
      .then(() => {
        toast.success("Account deletion cancelled. You're safe!", { id: tid });
        setStatus("success");
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || "Link is invalid or expired.";
        toast.error(msg, { id: tid });
        setMessage(msg);
        setStatus("error");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-night-950 text-white flex items-center justify-center px-4">
      <div className="bg-night-900 border border-white/5 rounded-3xl p-8 max-w-md w-full text-center flex flex-col gap-4 animate-scale-in">
        {status === "loading" && <p className="text-zinc-400">Processing...</p>}
        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-400">Deletion Cancelled</h1>
            <p className="text-zinc-400 text-sm">
              Your account deletion has been cancelled. Your account is safe.
            </p>
            <button onClick={() => navigate("/")}
              className="mt-2 px-6 py-2.5 rounded-full ember-gradient shadow-lg shadow-ember/30 text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer">
              Go to Home
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-yellow-400">Link Invalid</h1>
            <p className="text-zinc-400 text-sm">{message}</p>
            <button onClick={() => navigate("/")}
              className="mt-2 px-6 py-2.5 rounded-full ember-gradient shadow-lg shadow-ember/30 text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer">
              Go to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}