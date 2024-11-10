import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://pixabay.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API request failed:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
