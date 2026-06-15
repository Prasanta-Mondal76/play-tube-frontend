import api from "./axios.js";


/*

router.route("/video-comments/:videoId").get(getVideoComments) // public

router.use(verifyJWT)

router.route("/add/:videoId").post(addComment)
router.route("/update/:commentId").patch(updateComment)
router.route("/delete/:commentId").delete(deleteComment)
*/


export const getVideoComments = async (
  videoId,
  params = {}
) => {

  return await api.get(
    `/api/v1/comments/video-comments/${videoId}`,
    { params }
  );

};

export const addComment = async (
  videoId,
  data
) => {

  return await api.post(
    `/api/v1/comments/add/${videoId}`,
    data
  );

};

export const updateComment = async (
  commentId,
  data
) => {

  return await api.patch(
    `/api/v1/comments/update/${commentId}`,
    data
  );

};

export const deleteComment = async (
  commentId
) => {

  return await api.delete(
    `/api/v1/comments/delete/${commentId}`
  );

};