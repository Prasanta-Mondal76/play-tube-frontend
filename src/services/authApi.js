import api from "./axios.js";

export const loginUser = async (data) => {
   return await api.post(
      "/api/v1/users/login",
      data
   );
};

export const initiateRegistration = async (formData) => {
   return await api.post(
      "/api/v1/users/initiate-registration",
      formData,
      {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      }
   );
};

export const verifyRegistrationOtp = async (data) => {
   return await api.post(
      "/api/v1/users/verify-registration",
      data
   );
};

export const logoutUser = async () => {
   return await api.post(
      "/api/v1/users/logout"
   );
};

