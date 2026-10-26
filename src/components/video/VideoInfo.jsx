import { useState, useContext } from "react";
import { BoxContext } from "../../context/BoxContextProvider.jsx";
import { LoginContext } from "../../context/LoginContextProvider.jsx";

import {
  ThumbsUp,
  Bell,
  PlusCircle
} from "lucide-react";

import { toggleVideoLike } from "../../services/likeApi.js";
import { toggleSubscription } from "../../services/subscriptionApi.js";
import { AddToPlaylist } from "./AddToPlaylist.jsx";

export function VideoInfo({
  video,
  setVideo,
}) {

  const { setIsLoginBoxOpen } = useContext(BoxContext);
  const { isLogIn, user } = useContext(LoginContext);

  // const isOwner = isLogIn && user?._id === video.owner._id;

  const [likeLoading, setLikeLoading] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [showPlaylistBox, setShowPlaylistBox] = useState(false);


  if (!video) return null;

  // VIDEO LIKE
  const handleVideoLike = async () => {
    if (!isLogIn) {
      setIsLoginBoxOpen(true);
      return;
    }

    if (likeLoading) return;

    const previousLiked = video.isLiked;

    const previousLikes = video.likes;

    try {

      setLikeLoading(true);

      // Optimistic Update
      setVideo((prev) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked
          ? prev.likes - 1
          : prev.likes + 1,
      }));

      await toggleVideoLike(
        video._id
      );
    }
    catch (error) {
      console.log(error);
      // Rollback
      setVideo((prev) => ({
        ...prev,
        isLiked: previousLiked,
        likes: previousLikes,
      }));
    }
    finally {
      setTimeout(() => {
        setLikeLoading(false);
      }, 3000);
    }
  };

  // SUBSCRIBE
  const handleSubscription =
    async () => {
      if (!isLogIn) {
        setIsLoginBoxOpen(true);
        return;
      }

      if (subscribeLoading) return;

      const previousSubscribed = video.isSubscribed;
      const previousSubscribers = video.owner.totalSubscribers;

      try {

        setSubscribeLoading(true);

        // Optimistic Update

        setVideo((prev) => (
          {
            ...prev,
            isSubscribed: !prev.isSubscribed,
            owner: {
              ...prev.owner,
              totalSubscribers: prev.isSubscribed ? prev.owner.totalSubscribers - 1 : prev.owner.totalSubscribers + 1,
            },
          }
        ));

        await toggleSubscription(
          video.owner._id
        );

      }
      catch (error) {

        console.log(error);

        // Rollback

        setVideo((prev) => ({

          ...prev,

          isSubscribed:
            previousSubscribed,

          owner: {

            ...prev.owner,

            totalSubscribers:
              previousSubscribers,

          },

        }));
      }
      finally {
        setTimeout(() => {
          setSubscribeLoading(false);
        }, 3000);
      }
    };

  return (
    <div className="mt-4">

      {/* TITLE */}
      <h1
        className="
          text-xl
          sm:text-2xl
          font-extrabold
          tracking-tight
          text-white
        "
      >
        {video.title}

      </h1>

      {/* CHANNEL + ACTIONS */}
      <div
        className="
          mt-5
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-5
        "
      >

        {/* LEFT */}
        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          {/* AVATAR */}
          <img
            src={video.owner.avatar}
            alt={video.owner.fullName}
            className="
              h-12
              w-12
              shrink-0
              rounded-full
              object-cover
              ring-2 ring-ember/50
            "
          />

          {/* CHANNEL DETAILS */}
          <div>
            <h2
              className="
                text-white
                font-semibold
              "
            >
              {video.owner.fullName}
            </h2>

            <p
              className="
                text-sm
                text-zinc-400
              "
            >
              @{video.owner.username}
            </p>

            <p
              className="
                text-xs
                text-zinc-500
              "
            >
              {
                video.owner
                  .totalSubscribers || 0
              }
              {" "}
              subscribers
            </p>

          </div>

          {/* SUBSCRIBE BUTTON */}
          {
            !video.isOwner && (
              <button
                onClick={
                  handleSubscription
                }
                disabled={
                  subscribeLoading
                }
                className={`
                  ml-2
                  rounded-full
                  px-5
                  py-2
                  font-semibold
                  transition
                  cursor-pointer

                  disabled:opacity-50
                  disabled:cursor-not-allowed

                  ${video.isSubscribed
                    ? `
                        bg-night-700
                        text-white
                        ring-1 ring-white/10
                        hover:bg-night-600
                      `
                    : `
                        ember-gradient
                        text-white
                        shadow-lg shadow-ember/30
                        hover:brightness-110
                      `
                  }
                `}
              >
                {
                  video.isSubscribed
                    ? "Unsubscribe"
                    : "Subscribe"
                }
              </button>
            )
          }

        </div>

        {/* RIGHT ACTIONS */}
        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          {/* LIKE BUTTON */}
          <button
            onClick={handleVideoLike}
            disabled={likeLoading}
            className={`
              flex
              items-center
              gap-2
              rounded-full
              px-5
              py-2
              transition
              cursor-pointer

              disabled:opacity-50
              disabled:cursor-not-allowed
              bg-night-700
              p-3
              hover:bg-night-600
            `}
          >
            <ThumbsUp
              className={`h-5 w-5 ${video.isLiked ? "fill-ember text-ember" : "text-white"}`}
            />
            <span className="text-white">
              {video.likes || 0}
            </span>
          </button>

          {/* Add Button */}
          <button
            type="button"
            onClick={() => {
              if (!isLogIn) { setIsLoginBoxOpen(true); return; }
              setShowPlaylistBox(true);
            }}
            className="flex items-center gap-2 rounded-full bg-night-700 px-5 py-2
             text-white hover:bg-night-600 transition cursor-pointer"
          >
            <PlusCircle className="h-5 w-5" />
            Add
          </button>

          {/* BELL */}
          <button
            className="
              rounded-full
              bg-night-700
              p-3
              hover:bg-night-600
              transition
              cursor-pointer
            "
          >
            <Bell
              className="
                h-5
                w-5
                text-white
              "
            />
          </button>
        </div>

      </div>

      {/* DESCRIPTION */}
      <div
        className="
          mt-5
          rounded-2xl
          bg-night-800
          p-4
          transition
          hover:bg-night-700/70
        "
      >
        {/* VIEWS */}
        <div
          className="
            mb-2
            text-sm
            font-semibold
            text-zinc-300
          "
        >
          {video.views} views
        </div>

        {/* DESCRIPTION */}
        <p
          className="
            whitespace-pre-line
            text-zinc-200
          "
        >
          {video.description}
        </p>
      </div>

      {/* Playlist Popup Box */}
      {showPlaylistBox && (
        <AddToPlaylist
          videoId={video._id}
          onClose={() => setShowPlaylistBox(false)}
        />
      )}
    </div>

  );

}