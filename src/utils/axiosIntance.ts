// utils/axiosInstance.ts
import axios from "axios";
import { getSession } from "next-auth/react";
// http://localhost:5000/api
// https://adbacklist-backend2-0-vb3d.vercel.app/api
const baseApi = axios.create({
  baseURL: "http://localhost:5000/api",
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

export default baseApi;
