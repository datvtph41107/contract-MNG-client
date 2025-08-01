// import { useAppSelector } from "~/redux/hooks";
// import { ROLE, type PERMISSION } from "~/types/auth.types";
// import { tokenService } from "~/services/TokenService";

// export const useAuth = () => {
//     const { user, token, isAuthenticated, isLoading, error, lastActivity } = useAppSelector((state) => state.auth);
//     // Get token from memory service instead of Redux state
//     // const token = tokenService.getToken();
//     console.log("Use Auth:", isAuthenticated);

//     const checkRole = (role: ROLE): boolean => {
//         return user?.role === role;
//     };

//     const checkAnyRole = (roles: ROLE[]): boolean => {
//         if (!user?.role) return false;
//         return roles.includes(user.role);
//     };

//     const hasPermission = (permission: PERMISSION): boolean => {
//         if (!user?.permissions) return false;
//         return user.permissions.includes(permission);
//     };

//     const hasAllPermissions = (permissions: PERMISSION[]): boolean => {
//         if (!user?.permissions) return false;
//         return permissions.every((permission) => user.permissions.includes(permission));
//     };

//     const hasAnyPermissions = (permissions: PERMISSION[]): boolean => {
//         if (!user?.permissions) return false;
//         return permissions.some((permission) => user.permissions.includes(permission));
//     };

//     const isAdmin = (): boolean => {
//         return checkRole(ROLE.ADMIN);
//     };

//     const isManager = (): boolean => {
//         return checkRole(ROLE.MANAGER);
//     };

//     const isUser = (): boolean => {
//         return checkRole(ROLE.USER);
//     };

//     // Check if token is valid and not expired
//     const hasValidToken = (): boolean => {
//         return !!token && !tokenService.isTokenExpired();
//     };

//     // Get token info for debugging
//     const getTokenInfo = () => {
//         return tokenService.getTokenInfo();
//     };

//     return {
//         user,
//         token,
//         isAuthenticated: isAuthenticated && hasValidToken(),
//         isLoading,
//         error,
//         lastActivity,
//         checkRole,
//         checkAnyRole,
//         hasPermission,
//         hasAllPermissions,
//         hasAnyPermissions,
//         isAdmin,
//         isManager,
//         isUser,
//         hasValidToken,
//         getTokenInfo,
//     };
// };
