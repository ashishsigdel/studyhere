import axios, { AxiosInstance } from "axios";

export const baseUrl = `/api`;

const myAxios: AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

myAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        await myAxios.post("/auth/refresh");

        // Retry the original request with the new token
        return myAxios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out.");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
export { myAxios };
