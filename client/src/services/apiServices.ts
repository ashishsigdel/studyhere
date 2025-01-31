import axios from "axios";

export const baseAPIUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

const myAxios = axios.create({
  baseURL: baseAPIUrl,
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
      const pathname = window.location.pathname;
      const currentUrl = encodeURIComponent(pathname);
      window.location.href = `/login?redirect=${currentUrl}`;
    }

    return Promise.reject(error);
  }
);

export { myAxios };
