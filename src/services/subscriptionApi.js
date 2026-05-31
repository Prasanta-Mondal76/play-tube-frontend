import api from "./axios";

/*
router.use(verifyJWT)

router.route("/channel/:channelId").post(toggleSubscription)
router.route("/channel/:channelId/stats").get(getSubscriptionStats)
*/

export const toggleSubscription = async (channelId) => {
  return await api.post(
    `/api/v1/subscriptions/channel/${channelId}`
  );

};

export const getSubscriptionStats = async (channelId) => {

  return await api.get(
    `/api/v1/subscriptions/channel/${channelId}/stats`
  );

};