import axios from "axios";
import api from "./axios.js";

// 1-stage (direct) upload:
// The file goes STRAIGHT from the browser to Cloudinary — our server is
// not in the middle anymore. The backend only hands out a one-time
// signature first (the secret key never leaves the server), and later
// receives just the final Cloudinary URL to save in the database.
//
// Returns Cloudinary's upload result: { secure_url, public_id,
// duration (for videos), ... }
export async function uploadToCloudinary(file, { resourceType = "image", onProgress } = {}) {
  const sigRes = await api.get("/api/v1/uploads/signature");
  const { signature, timestamp, folder, apiKey, cloudName } = sigRes.data.data;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    formData,
    {
      onUploadProgress: (e) => {
        if (e.total && onProgress) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    }
  );

  return res.data;
}
