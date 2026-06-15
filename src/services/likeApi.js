import api from "./axios.js";


/*
router.route("/video/:videoId").post(toggleVideoLike)
router.route("/comment/:commentId").post(toggleCommentLike)
router.route("/videos").get(getLikedVideos)
router.route("/status").get(getLikeStatus) 
router.route("/channel-total-likes").get(getChannelTotalLike)
*/

export const toggleVideoLike = async (
   videoId
) => {

   return await api.post(
      `/api/v1/likes/video/${videoId}`
   );

};

export const toggleCommentLike = async (
   commentId
) => {

   return await api.post(
      `/api/v1/likes/comment/${commentId}`
   );

};

export const getLikeStatus = async (
   params
) => {

   return await api.get(
      `/api/v1/likes/status`,
      { params }
   );

};

export const getTotalVideoLike = async () =>{
   return await api.get("/api/v1/likes/channel-total-likes")
}