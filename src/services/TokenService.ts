/**
 * 🔐 TokenService - Quản lý access token trong memory
 * Chỉ lưu trữ access token trong RAM, refresh token được lưu trong HTTP-only cookies
 */
class TokenService {
    private accessToken: string | null = null;
    private tokenExpiry: number | null = null;
    private refreshPromise: Promise<string> | null = null;

    /**
     * Set access token và expiry time
     */
    setToken(token: string, expiry?: number): void {
        this.accessToken = token;
        this.tokenExpiry = expiry || null;
        console.log("🔐 TokenService: Token set in memory", {
            hasToken: !!token,
            expiry: expiry ? new Date(expiry).toISOString() : null,
        });
    }

    /**
     * Get access token từ memory
     */
    getToken(): string | null {
        return this.accessToken;
    }

    /**
     * Check if token exists
     */
    hasToken(): boolean {
        return !!this.accessToken;
    }

    /**
     * Check if token is expired
     */
    isTokenExpired(): boolean {
        if (!this.tokenExpiry) return false;
        return Date.now() >= this.tokenExpiry;
    }

    /**
     * Check if token will expire soon (within 5 minutes)
     */
    isTokenExpiringSoon(): boolean {
        if (!this.tokenExpiry) return false;
        const fiveMinutes = 5 * 60 * 1000;
        return Date.now() >= this.tokenExpiry - fiveMinutes;
    }

    /**
     * Clear token từ memory
     */
    clearToken(): void {
        this.accessToken = null;
        this.tokenExpiry = null;
        this.refreshPromise = null;
        console.log("🔐 TokenService: Token cleared from memory");
    }

    /**
     * Set refresh promise để tránh multiple refresh calls
     */
    setRefreshPromise(promise: Promise<string>): void {
        this.refreshPromise = promise;
    }

    /**
     * Get current refresh promise
     */
    getRefreshPromise(): Promise<string> | null {
        return this.refreshPromise;
    }

    /**
     * Clear refresh promise
     */
    clearRefreshPromise(): void {
        this.refreshPromise = null;
    }

    /**
     * Get token info for debugging
     */
    getTokenInfo() {
        return {
            hasToken: this.hasToken(),
            isExpired: this.isTokenExpired(),
            isExpiringSoon: this.isTokenExpiringSoon(),
            expiry: this.tokenExpiry ? new Date(this.tokenExpiry).toISOString() : null,
        };
    }
}

// Export singleton instance
export const tokenService = new TokenService();
