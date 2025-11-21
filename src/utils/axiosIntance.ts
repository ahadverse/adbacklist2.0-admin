// utils/axiosInstance.ts
import axios from "axios";
import { getSession, signOut } from "next-auth/react";
// http://localhost:5000/api
// https://adbacklist-backend2-0-vb3d.vercel.app/api
const baseApi = axios.create({
  baseURL: "https://adbacklist-backend2-0-vb3d.vercel.app/api",
});

// Add a request interceptor to automatically attach the token
baseApi.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = session?.user?.token;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

baseApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
      console.log(status)
    if (status === 401) {
      console.warn("⛔ Unauthorized! Auto logging out…");

      // Clear session & redirect to login
      await signOut({ redirect: true, callbackUrl: "/signin" });
    }
    if (status === 403) {
      console.warn("⛔ Unauthorized! Auto logging out…");

      // Clear session & redirect to login
      await signOut({ redirect: true, callbackUrl: "/signin" });
    }

    return Promise.reject(error);
  }
);

export default baseApi;
