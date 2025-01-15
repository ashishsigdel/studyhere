import axios, { AxiosInstance } from "axios";

export const baseUrl = `/api`;

const myAxios: AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
export { myAxios };
