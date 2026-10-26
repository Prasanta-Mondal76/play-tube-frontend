import { useContext, useState, useEffect } from "react";
import { Pencil, Upload } from "lucide-react";
import { LoginContext } from "../../../context/LoginContextProvider.jsx";
import { BoxContext } from "../../../context/BoxContextProvider.jsx";
import { toggleSubscription } from "../../../services/subscriptionApi.js";
import { getDashStats } from "../../../services/dashboardApi.js";
import { UploadVideo } from "../dashMethods/UploadVideo.jsx";
import { UpdateImages } from "../dashMethods/UpdateImages.jsx";

export function ChannelHeader() {

  const { user, isLogIn } = useContext(LoginContext);
  const { setIsLoginBoxOpen } = useContext(BoxContext);
  const [channel, setChannel] = useState()
  const [openUploadBox, setOpenUploadBox] = useState(false);
  const [openUpdateBox, setOpenUpdateBox] = useState(false);

  useEffect(() => {
    async function fetchChannel() {
      try {
        const result = await getDashStats();
        setChannel(result.data.data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    }

    fetchChannel();
  }, []);

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
    <div className="pb-3" >

      {/* COVER IMAGE */}
      <div className="w-full h-40 sm:h-52 md:h-64 rounded-2xl overflow-hidden bg-night-800">
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
              {channel.totalSubscribers || 0} subscribers
            </p>
          </div>
        </div>

        {/* RIGHT — Button */}
        <div className="flex items-center gap-3 sm:shrink-0">

          <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-night-700 text-white text-sm font-semibold hover:bg-night-600 transition cursor-pointer"
            onClick={() => setOpenUpdateBox(true)}
          >
            <Pencil className="h-4 w-4" />
            Update
          </button>

          <button className="flex items-center gap-2 px-5 py-2 rounded-full ember-gradient shadow-lg shadow-ember/30 text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer"
            onClick={() => setOpenUploadBox(true)}
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
        </div>

      </div>
      {
        openUploadBox && (
          <UploadVideo
            setOpenUploadBox={setOpenUploadBox}
          />
        )
      }

      {/* update avatar and cover image */}
      {openUpdateBox && (
        <UpdateImages
          setOpenUpdateBox={setOpenUpdateBox}
          setChannel={setChannel}       
        />
      )}
    </div>
  );
}
