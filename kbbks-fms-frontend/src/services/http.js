import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8081";

const http = axios.create({
  baseURL: BASE_URL,
  // we'll let the request interceptor handle setting Content-Type so that
  // multipart/form-data can be used automatically when a FormData payload is
  // provided.
});

console.log("Axios Base URL:", http.defaults.baseURL);
// Add request interceptor to include token
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // if we're sending FormData, axios will set the correct Content-Type
    // including boundary for us. however our previous default header would
    // have forced application/json and prevented file uploads from working.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default http;
