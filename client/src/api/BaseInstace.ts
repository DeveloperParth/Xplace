import Axios from "axios";
import { useAuth } from "../store/useAuth";
import { showNotification } from "@mantine/notifications";

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9000",
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().token;
    if (token) {
      config.headers = {
        ...config?.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 400) {
      showNotification({
        title: "Error",
        message: error.response.data.message,
      });
    }
    return Promise.reject(error);
  }
);

export default axios;
