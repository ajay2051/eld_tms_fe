
const TOKEN_KEYS = {
    ACCESS:  "access_token",
    REFRESH: "refresh_token",
    USER:    "user",
} as const;

/**
 * Clears all auth tokens and user data from both localStorage and sessionStorage,
 * then redirects to the login page.
 *
 * Usage:
 *   import { logout } from "@/utils/logout";
 *   <button onClick={() => logout(navigate)}>Logout</button>
 */
export function logout(navigate: (path: string) => void): void {
    // Clear from both storages so "remember me" and session-only logins are both wiped
    Object.values(TOKEN_KEYS).forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    });
    navigate("/");
}

/**
 * Returns the stored access token (checks localStorage first, then sessionStorage).
 */
export function getAccessToken(): string | null {
    return (
        localStorage.getItem(TOKEN_KEYS.ACCESS) ||
        sessionStorage.getItem(TOKEN_KEYS.ACCESS)
    );
}

/**
 * Returns the stored user object, or null if not found / parse fails.
 */
export function getStoredUser<T = Record<string, unknown>>(): T | null {
    const raw =
        localStorage.getItem(TOKEN_KEYS.USER) ||
        sessionStorage.getItem(TOKEN_KEYS.USER);
    if (!raw) return null;
    try { return JSON.parse(raw) as T; }
    catch { return null; }
}