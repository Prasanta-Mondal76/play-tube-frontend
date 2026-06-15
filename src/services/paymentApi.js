import api from "./axios.js";

// Check if the current user has an active payment
export const getPaymentStatus = () =>
  api.get("/api/v1/payments/status");

// Create a Razorpay order for the selected plan
export const createOrder = (planId) =>
  api.post("/api/v1/payments/create-order", { planId });

// Verify payment after Razorpay checkout succeeds
export const verifyPayment = (paymentData) =>
  api.post("/api/v1/payments/verify", paymentData);