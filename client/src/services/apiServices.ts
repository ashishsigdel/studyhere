import axios from "axios";

export const baseAPIUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

const myAxios = axios.create({
  baseURL: baseAPIUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 10000, // Add timeout
});

// Add request interceptor to handle CORS preflight
myAxios.interceptors.request.use(
  (config) => {
    // Ensure credentials are always included
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Modify your response interceptor to be more robust
myAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      // Store the current URL for redirect after login
      const pathname = window.location.pathname;
      const searchParams = window.location.search;
      const currentUrl = encodeURIComponent(pathname + searchParams);

      // Redirect to login
      window.location.href = `/login?redirect=${currentUrl}`;
      return Promise.reject(error);
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export { myAxios };
