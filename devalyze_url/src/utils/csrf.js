// src/utils/csrf.js

/**
 * CSRF Token Management Utilities
 * Handles fetching, storing, and retrieving CSRF tokens
 */

const API_BASE_URL =
    import.meta.env.MODE === "development"
        ? import.meta.env.VITE_API_BASE_URL_DEV
        : import.meta.env.VITE_API_BASE_URL;

/**
 * Get CSRF token from cookie
 */
export function getCsrfTokenFromCookie() {
    const name = '_csrf=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name)) {
            const token = cookie.substring(name.length);
            console.log('✅ CSRF token found in cookie:', token.substring(0, 16) + '...');
            return token;
        }
    }

    console.warn('⚠️ No CSRF token found in cookies');
    return null;
}

/**
 * Validate token format (32 bytes hex = 64 chars)
 */
export function isValidTokenFormat(token) {
    if (!token || typeof token !== 'string') return false;
    return /^[a-f0-9]{64}$/i.test(token);
}

/**
 * Fetch a fresh CSRF token from the server
 */
export async function fetchCsrfToken() {
    try {
        console.log('🔄 Fetching new CSRF token from server...');
        const response = await fetch(`${API_BASE_URL}/api/csrf-token`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.csrfToken) {
            throw new Error('No CSRF token in response');
        }

        console.log('✅ CSRF token received:', data.csrfToken.substring(0, 16) + '...');
        return data.csrfToken;

    } catch (error) {
        console.error('❌ Error fetching CSRF token:', error);
        throw error;
    }
}

/**
 * Initialize CSRF token on app startup
 */
export async function initializeCsrfToken() {
    let token = getCsrfTokenFromCookie();
    if (token && isValidTokenFormat(token)) {
        console.log('♻️ Using existing CSRF token from cookie');
        return token;
    }

    token = await fetchCsrfToken();
    if (!getCsrfTokenFromCookie()) {
        console.warn('⚠️ CSRF token fetched but not yet in cookies');
    }

    return token;
}

/**
 * Refresh token (after logout or expiration)
 */
export async function refreshCsrfToken() {
    return await fetchCsrfToken();
}

/**
 * Clear CSRF token
 */
export function clearCsrfToken() {
    console.log('🗑️ CSRF token cleared (server should remove cookie)');
}

/**
 * Check if token exists
 */
export function hasCsrfToken() {
    return getCsrfTokenFromCookie() !== null;
}

/**
 * Get validated token
 */
export function getValidatedToken() {
    const token = getCsrfTokenFromCookie();
    if (!token || !isValidTokenFormat(token)) {
        console.warn('⚠️ Invalid or missing CSRF token');
        return null;
    }
    return token;
}
