// import { useEffect, useRef } from "react";
// import { httpRequestPrivate } from "~/utils/httpRequest";
// import { useAppSelector, useAppDispatch } from "~/redux/hooks";
// import { refreshToken, syncTokenFromService, resetAuth } from "~/redux/slices/auth.slice";
// import { unwrapResult } from "@reduxjs/toolkit";
// import { tokenService } from "~/services/TokenService";

// const useHttpRequestPrivate = () => {
//     const dispatch = useAppDispatch();
//     const { isAuthenticated, token } = useAppSelector((state) => state.auth);
//     const isRefreshingRef = useRef(false);
//     const failedQueueRef = useRef<
//         Array<{
//             resolve: (token: string) => void;
//             reject: (error: unknown) => void;
//         }>
//     >([]);

//     useEffect(() => {
//         // Sync token from service to Redux on mount
//         // dispatch(syncTokenFromService());

//         const requestInterceptor = httpRequestPrivate.interceptors.request.use(
//             (config) => {
//                 // Always get fresh token from service
//                 // const currentToken = tokenService.getToken();

//                 if (!config.headers["Authorization"] && token) {
//                     config.headers["Authorization"] = `Bearer ${token}`;
//                 }

//                 return config;
//             },
//             (error) => Promise.reject(error),
//         );

//         const responseInterceptor = httpRequestPrivate.interceptors.response.use(
//             (response) => response,
//             async (error) => {
//                 const originalRequest = error.config;

//                 if (error?.response?.status === 403 && !originalRequest._retry) {
//                     if (isRefreshingRef.current) {
//                         // If already refreshing, queue this request
//                         return new Promise((resolve, reject) => {
//                             failedQueueRef.current.push({ resolve, reject });
//                         })
//                             .then((token) => {
//                                 originalRequest.headers["Authorization"] = `Bearer ${token}`;
//                                 return httpRequestPrivate(originalRequest);
//                             })
//                             .catch((err) => {
//                                 return Promise.reject(err);
//                             });
//                     }

//                     originalRequest._retry = true;
//                     isRefreshingRef.current = true;

//                     try {
//                         console.log("🔄 Token expired, attempting refresh...");
//                         const result = await dispatch(refreshToken()).then(unwrapResult);

//                         const newToken = result.accessToken;
//                         // Retry original request with new token
//                         originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//                         return httpRequestPrivate(originalRequest);
//                     } catch (refreshError) {
//                         console.error("🔁 Refresh token failed", refreshError);
//                         // Clear auth state and redirect to login
//                         dispatch(resetAuth());
//                         // Redirect to appropriate login page
//                         const isAdminRoute = window.location.pathname.includes("/admin");
//                         const loginPath = isAdminRoute ? "/admin/login" : "/login";
//                         window.location.href = loginPath;

//                         return Promise.reject(refreshError);
//                     } finally {
//                         isRefreshingRef.current = false;
//                     }
//                 }

//                 return Promise.reject(error);
//             },
//         );

//         return () => {
//             httpRequestPrivate.interceptors.request.eject(requestInterceptor);
//             httpRequestPrivate.interceptors.response.eject(responseInterceptor);
//         };
//     }, [token]); // Remove token dependency to avoid re-creating interceptors

//     return httpRequestPrivate;
// };

// export default useHttpRequestPrivate;
