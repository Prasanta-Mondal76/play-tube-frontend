import { useContext } from "react";
import { Settings } from "lucide-react";
import { LoginContext } from "../../context/LoginContextProvider";
import { BoxContext } from "../../context/BoxContextProvider";
import { toggleSubscription } from "../../services/subscriptionApi";

export function ProfileHeader({ channel, setChannel }) {

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

    } catch (error) {
      console.log(error);
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
      <div className="w-full h-40 sm:h-52 md:h-64 rounded-2xl overflow-hidden bg-zinc-800">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-700" />
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
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-black -mt-10 sm:-mt-12 flex-shrink-0"
          />

          {/* TEXT */}
          <div>
            <h1 className="text-xl font-bold text-white">
              {channel.fullName}
            </h1>
            <p className="text-sm text-zinc-400">@{channel.username}</p>
            <p className="text-sm text-zinc-500 mt-0.5">
              {channel.totalSubscribers || 0} subscribers
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
                  ? "bg-zinc-700 text-white hover:bg-zinc-600"
                  : "bg-white text-black hover:bg-zinc-200"
                }
              `}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}

          {/* CUSTOMIZE — only if owner */}
          {isOwner && (
            <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-zinc-800 text-white text-sm font-semibold hover:bg-zinc-700 transition cursor-pointer">
              <Settings className="h-4 w-4" />
              Customize
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
