import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true, // Permite enviar e recibir cookies
});
