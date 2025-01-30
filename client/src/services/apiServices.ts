import axios from "axios";

export const baseAPIUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

const myAxios = axios.create({
  baseURL: baseAPIUrl,
  headers: {
    "Content-Type": "application/json",
  },
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
