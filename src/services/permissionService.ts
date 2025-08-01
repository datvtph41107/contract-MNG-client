/**
 * Permission Service
 * Handles all permission-related logic
 * Implements Strategy pattern for extensible permission checking
 */

import type { IUser, UserRole, IAccessContext } from "../types";
import { ROLE_HIERARCHY, ROLE_PERMISSION_MATRIX } from "../constants/roles";

export interface IPermissionService {
    hasPermission(user: IUser | null, permission: string): boolean;
    hasRole(user: IUser | null, role: UserRole): boolean;
    hasAnyRole(user: IUser | null, roles: ReadonlyArray<UserRole>): boolean;
    hasMinimumRole(user: IUser | null, minimumRole: UserRole): boolean;
    canAccess(context: IAccessContext): boolean;
    getUserPermissions(user: IUser): ReadonlyArray<string>;
}

/**
 * Permission Checking Strategies
 */
interface IPermissionStrategy {
    check(context: IAccessContext): boolean;
}

class BasicPermissionStrategy implements IPermissionStrategy {
    check(context: IAccessContext): boolean {
        const service = PermissionService.getInstance();
        return service.hasPermission(context.user, `${context.resource}:${context.action}`);
    }
}

class DataLevelPermissionStrategy implements IPermissionStrategy {
    check(context: IAccessContext): boolean {
        // Future implementation for data-level permissions
        // Example: Check if user can access specific contract based on department, etc.
        return true;
    }
}

class PermissionService implements IPermissionService {
    private static instance: PermissionService;
    private readonly strategies: Map<string, IPermissionStrategy>;

    private constructor() {
        this.strategies = new Map([
            ["basic", new BasicPermissionStrategy()],
            ["data-level", new DataLevelPermissionStrategy()],
        ]);
    }

    /**
     * Singleton Pattern Implementation
     */
    public static getInstance(): PermissionService {
        if (!PermissionService.instance) {
            PermissionService.instance = new PermissionService();
        }
        return PermissionService.instance;
    }

    /**
     * Check if user has specific permission
     */
    public hasPermission(user: IUser | null, permission: string): boolean {
        if (!this.isUserValid(user)) return false;

        const userPermissions = this.getUserPermissions(user!);
        return userPermissions.includes(permission);
    }

    /**
     * Check if user has specific role
     */
    public hasRole(user: IUser | null, role: UserRole): boolean {
        return this.isUserValid(user) && user!.role === role;
    }

    /**
     * Check if user has any of the specified roles
     */
    public hasAnyRole(user: IUser | null, roles: ReadonlyArray<UserRole>): boolean {
        return this.isUserValid(user) && roles.includes(user!.role);
    }

    /**
     * Check if user has minimum role level
     */
    public hasMinimumRole(user: IUser | null, minimumRole: UserRole): boolean {
        if (!this.isUserValid(user)) return false;

        const userLevel = ROLE_HIERARCHY[user!.role];
        const requiredLevel = ROLE_HIERARCHY[minimumRole];

        return userLevel >= requiredLevel;
    }

    /**
     * Advanced access control with strategy pattern
     */
    public canAccess(context: IAccessContext): boolean {
        // Use basic strategy by default, can be extended for complex scenarios
        const strategy = this.strategies.get("basic");
        return strategy?.check(context) ?? false;
    }

    /**
     * Get all permissions for user (role-based + explicit)
     */
    public getUserPermissions(user: IUser): ReadonlyArray<string> {
        const rolePermissions = ROLE_PERMISSION_MATRIX[user.role] || [];
        const explicitPermissions = user.permissions || [];

        // Combine and deduplicate permissions
        const allPermissions = [...rolePermissions, ...explicitPermissions];
        return Array.from(new Set(allPermissions));
    }

    /**
     * Validate user object
     */
    private isUserValid(user: IUser | null): user is IUser {
        return user !== null && user.isActive;
    }

    /**
     * Register new permission strategy (for future extensions)
     */
    public registerStrategy(name: string, strategy: IPermissionStrategy): void {
        this.strategies.set(name, strategy);
    }
}

export { PermissionService };
