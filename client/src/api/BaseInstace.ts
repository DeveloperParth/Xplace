import Axios from "axios";
import ReactDOM from "react-dom";
import { useAuth } from "../store/useAuth";

const axios = Axios.create({
  baseURL: "http://localhost:3000",
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
    alert(error.response.data.message);
    console.log(error.response);

    return Promise.reject(error);
  }
);

export default axios;
