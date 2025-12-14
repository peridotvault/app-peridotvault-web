import axios from "axios";

export const http = axios.create({
    baseURL: process.env.PUBLIC_API_BASE_URL ?? "https://api.peridotvault.com",
    timeout: 15_000,
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);
