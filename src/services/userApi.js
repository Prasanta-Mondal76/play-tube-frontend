import api from "./axios";

export const getLoginStats = async () => {
  return await api.get("/api/v1/users/login-stats")
}

export const getCurrentUser = async () => {
  return await api.get("/api/v1/users/current-user");
};

// Channel details by username
export const getChannelDetails = async (username) => {
  return await api.get(`/api/v1/users/channel/${username}`);
};


// Update avatar
export const updateAvatar = async (formData) => {
  return await api.patch("/api/v1/users/update-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Update cover image
export const updateCoverImage = async (formData) => {
  return await api.patch("/api/v1/users/update-coverImage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Update fullName and/or username
export const updateUserData = async (data) => {
  return await api.patch("/api/v1/users/update-user", data);
};

// Email change — Step 1: request OTP
export const initiateEmailChange = async (newEmail) => {
  return await api.post("/api/v1/users/initiate-email-change", { newEmail });
};

// Email change — Step 2: verify OTP
export const verifyEmailChange = async (otp) => {
  return await api.post("/api/v1/users/verify-email-change", { otp });
};

// Update Settings account section
export const updateAbout = async (about) => {
  return await api.patch("/api/v1/users/update-about", { about });
};


export const logoutAllDevices = async () => {
  return await api.post("/api/v1/users/logout-all-devices");
};

export const cancelDeleteAccount = async (token) => {
  return await api.delete(`/api/v1/users/delete-account/cancel/${token}`)
}

export const confirmDeleteAccount = async (token) => {
  return api.delete(`/api/v1/users/delete-account/confirm/${token}`)
}