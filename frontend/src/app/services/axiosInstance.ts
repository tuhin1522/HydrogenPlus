import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
const baseURL = apiUrl.endsWith("/api/v1") ? apiUrl : `${apiUrl}/api/v1`;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT Token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;