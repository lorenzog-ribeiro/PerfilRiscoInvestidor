import axios from "axios";

export const AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "https://perfil-investidor-backend-rqabdl-234cf1-137-131-166-114.traefik.me/"
});
