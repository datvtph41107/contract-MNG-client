"use client";

import { useCallback } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { ApiManager } from "../core/api/ApiManager";
import type { ApiResponse } from "../types/api.types";
import type { TResponse, TParams, TBody } from "../types/api.types";

export interface UseApiOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
}

export function useApi() {
    const dispatch = useAppDispatch();
    const apiManager = ApiManager.getInstance();

    // Generic API call function
    const callApi = useCallback(
        async (
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
            url: string,
            options?: {
                params?: TParams;
                body?: TBody;
                isPrivate?: boolean;
                onSuccess?: (data: TResponse) => void;
                onError?: (error: string) => void;
            },
        ): Promise<TResponse | null> => {
            try {
                const { params, body, isPrivate = true, onSuccess, onError } = options || {};

                let response: ApiResponse<TResponse>;

                switch (method) {
                    case "GET":
                        response = isPrivate
                            ? await apiManager.privateGet<TResponse, TParams>(url, params)
                            : await apiManager.publicGet<TResponse, TParams>(url, params);
                        break;
                    case "POST":
                        response = isPrivate
                            ? await apiManager.privatePost<TResponse, TBody>(url, body)
                            : await apiManager.publicPost<TResponse, TBody>(url, body);
                        break;
                    case "PUT":
                        response = isPrivate
                            ? await apiManager.privatePut<TResponse, TBody>(url, body)
                            : await apiManager.publicPut<TResponse, TBody>(url, body);
                        break;
                    case "PATCH":
                        response = isPrivate
                            ? await apiManager.privatePatch<TResponse, TBody>(url, body)
                            : await apiManager.publicPatch<TResponse, TBody>(url, body);
                        break;
                    case "DELETE":
                        response = isPrivate
                            ? await apiManager.privateDelete<TResponse>(url)
                            : await apiManager.publicDelete<TResponse>(url);
                        break;
                    default:
                        throw new Error(`Unsupported method: ${method}`);
                }

                onSuccess?.(response.data);
                return response.data;
            } catch (error: any) {
                const errorMessage = error.message || `${method} request failed`;
                options?.onError?.(errorMessage);
                throw error;
            }
        },
        [apiManager],
    );

    // Convenience methods
    const get = useCallback(
        (url: string, params?: TParams, options?: UseApiOptions & { isPrivate?: boolean }) => callApi("GET", url, { params, ...options }),
        [callApi],
    );

    const post = useCallback(
        (url: string, body?: TBody, options?: UseApiOptions & { isPrivate?: boolean }) => callApi("POST", url, { body, ...options }),
        [callApi],
    );

    const put = useCallback(
        (url: string, body?: TBody, options?: UseApiOptions & { isPrivate?: boolean }) => callApi("PUT", url, { body, ...options }),
        [callApi],
    );

    const patch = useCallback(
        (url: string, body?: TBody, options?: UseApiOptions & { isPrivate?: boolean }) => callApi("PATCH", url, { body, ...options }),
        [callApi],
    );

    const del = useCallback((url: string, options?: UseApiOptions & { isPrivate?: boolean }) => callApi("DELETE", url, options), [callApi]);

    return {
        callApi,
        get,
        post,
        put,
        patch,
        delete: del,
    };
}
