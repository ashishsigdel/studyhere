import { removeAuth } from "@/redux/features/authSlice";
import axios, { AxiosInstance } from "axios";
import { store } from "@/redux/store"; // Import the Redux store directly

// export const baseUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}`;
export const baseUrl = `/api`;

const myAxios: AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshAccessToken = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken") || "";
    const response = await axios.post(
      `/api/auth/refresh-token`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    const newAccessToken: string = response.data.data.accessToken;
    localStorage.setItem("accessToken", newAccessToken);

    return newAccessToken;
  } catch (error: any) {
    const pathname = window.location.pathname;
    const searchParams = window.location.search;
    const currentUrl = encodeURIComponent(pathname + searchParams);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    // Use store.dispatch instead of useDispatch hook
    store.dispatch(removeAuth());
    window.location.href = `/login?redirect=${currentUrl}`;

    return null;
  }
};

myAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const byPassUrls = ["/auth/user", "/auth/refresh-token"];
    const originalRequest = error.config;

    // Skip refresh for these endpoints
    if (originalRequest && byPassUrls.includes(originalRequest.url)) {
      throw error;
    }

    const res = error.response;

    // 🔁 Handle 401: token expired
    if (res && res.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // custom retry flag

      const newAccessToken = await refreshAccessToken();
      if (!newAccessToken) {
        throw error;
      }

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return myAxios(originalRequest);
    }

    // 🟡 Handle soft-auth expired token (X-Access-Token-Expired)
    if (
      res &&
      res.headers["x-access-token-expired"] === "true" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // prevent infinite loop

      const newAccessToken = await refreshAccessToken();
      if (!newAccessToken) {
        throw error;
      }

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return myAxios(originalRequest);
    }

    throw error;
  }
);

myAxios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Uncomment to debug requests
// myAxios.interceptors.request.use((config) => {
//   console.log("Request was sent with this config:", config);
//   return config;
// });

export { myAxios, refreshAccessToken };
