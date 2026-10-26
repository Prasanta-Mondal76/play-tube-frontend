import { useContext } from "react";
import { Settings } from "lucide-react";
import { LoginContext } from "../../context/LoginContextProvider.jsx";
import { BoxContext } from "../../context/BoxContextProvider.jsx";
import { toggleSubscription } from "../../services/subscriptionApi.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Tids } from "../../utils/toastId.js";

export function ProfileHeader({ channel, setChannel }) {
  const navigate = useNavigate()
  const { user, isLogIn } = useContext(LoginContext);
  const { setIsLoginBoxOpen } = useContext(BoxContext);

  if (!channel) return null;

  const isOwner = isLogIn && user?._id === channel._id;
  const isSubscribed = channel.isSubscribed || false;

  const handleSubscribe = async () => {
    if (!isLogIn) {
      setIsLoginBoxOpen(true);
      return;
    }
    
    const previousSubscribed = isSubscribed;
    const previousCount = channel.totalSubscribers;

    toast.loading(
      isSubscribed ? "Unsubscribing..." : "Subscribing...",
      { id: Tids.toggleSubscription }
    );


    try {
      // Optimistic update
      setChannel((prev) => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        totalSubscribers: prev.isSubscribed
          ? prev.totalSubscribers - 1
          : prev.totalSubscribers + 1,
      }));

      await toggleSubscription(channel._id);

      toast.success(
        isSubscribed ? "Unsubscribed" : "Subscribed successfully!",
        { id: Tids.toggleSubscription }
      );

    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Something went wrong",
        { id: Tids.error }
      );
      // Rollback
      setChannel((prev) => ({
        ...prev,
        isSubscribed: previousSubscribed,
        totalSubscribers: previousCount,
      }));
    }
  };

  return (
    <div>

      {/* COVER IMAGE */}
      <div className="w-full h-40 sm:h-52 md:h-64 rounded-2xl overflow-hidden bg-night-800 relative">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2A0A0E] via-[#3D0A10] to-[#571B07]" />
        )}
      </div>

      {/* CHANNEL INFO ROW */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-1">

        {/* LEFT — Avatar + Info */}
        <div className="flex items-center gap-4">

          {/* AVATAR */}
          <img
            src={channel.avatar}
            alt={channel.fullName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-night-950 ring-2 ring-ember/50 -mt-10 sm:-mt-12 flex-shrink-0 relative"
          />

          {/* TEXT */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {channel.fullName}
            </h1>
            <p className="text-sm text-zinc-400">@{channel.username}</p>
            <p className="text-sm text-zinc-500 mt-0.5">
              <span className="text-zinc-300 font-medium">{channel.totalSubscribers || 0}</span> subscribers
            </p>
          </div>
        </div>

        {/* RIGHT — Buttons */}
        <div className="flex items-center gap-3 sm:flex-shrink-0">

          {/* SUBSCRIBE — only if not owner */}
          {!isOwner && (
            <button
              onClick={handleSubscribe}
              className={`
                px-5 py-2 rounded-full font-semibold text-sm transition cursor-pointer
                ${isSubscribed
                  ? "bg-night-700 text-white hover:bg-night-600"
                  : "ember-gradient shadow-lg shadow-ember/30 text-white hover:brightness-110"
                }
              `}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}

          {/* CUSTOMIZE — only if owner */}
          {isOwner && (
            <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-night-700 text-white text-sm font-semibold hover:bg-night-600 transition cursor-pointer"
              onClick={() => navigate("/creator/dashboard/channel")}
            >
              <Settings className="h-4 w-4" />
              Customize
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
