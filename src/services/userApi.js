import api from "./axios";

export const getCurrentUser = async () => {
   return await api.get("/api/v1/users/current-user");
};