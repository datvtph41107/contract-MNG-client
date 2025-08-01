import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:3001/api/v1";

/**
 * 📦 httpRequestPublic: dùng cho các API không cần token (login, register,...)
 */
export const httpRequestPublic: AxiosInstance = axios.create({
    baseURL: BASE_URL,
});

/**
 * 🔐 httpRequestPrivate: dùng cho các API cần token
 */
export const httpRequestPrivate: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const createHttpMethods = (instance: AxiosInstance) => {
    return {
        get: <T = unknown>(path: string, config: AxiosRequestConfig = {}): Promise<T> =>
            instance.get<T>(path, config).then((res) => res.data),

        post: <T = unknown, D = unknown>(path: string, data?: D, config: AxiosRequestConfig = {}): Promise<T> =>
            instance.post<T>(path, data, config).then((res) => res.data),

        put: <T = unknown, D = unknown>(path: string, data: D, config: AxiosRequestConfig = {}): Promise<T> =>
            instance.put<T>(path, data, config).then((res) => res.data),

        patch: <T = unknown, D = unknown>(path: string, data: D, config: AxiosRequestConfig = {}): Promise<T> =>
            instance.patch<T>(path, data, config).then((res) => res.data),

        delete: <T = unknown>(path: string, data?: Record<string, unknown>, config: AxiosRequestConfig = {}): Promise<T> =>
            instance.delete<T>(path, { ...config, data }).then((res) => res.data),

        upload: <T = unknown>(path: string, data: FormData, config: AxiosRequestConfig = {}): Promise<T> =>
            instance
                .post<T>(path, data, {
                    ...config,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        ...config.headers,
                    },
                })
                .then((res) => res.data),
    };
};
export const httpPublic = createHttpMethods(httpRequestPublic);
export const httpPrivate = createHttpMethods(httpRequestPrivate);
