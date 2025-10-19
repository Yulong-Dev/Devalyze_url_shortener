// devalyze_url/src/utils/csrf.js

/**
 * CSRF Token Management Utilities
 * Handles fetching, storing, and retrieving CSRF tokens
 */

// Get API base URL from environment
const API_BASE_URL =
    import.meta.env.MODE === "development"
        ? import.meta.env.VITE_API_BASE_URL_DEV
        : import.meta.env.VITE_API_BASE_URL;

/**
 * Get CSRF token from browser cookies
 * @returns {string|null} CSRF token or null if not found
 */
export function getCsrfTokenFromCookie() {
    const name = 'csrfToken=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        cookie = cookie.trim();

        if (cookie.indexOf(name) === 0) {
            const token = cookie.substring(name.length);
            console.log('✅ CSRF token found in cookie:', token.substring(0, 16) + '...');
            return token;
        }
    }

    console.warn('⚠️ No CSRF token found in cookies');
    return null;
}

/**
 * Fetch a fresh CSRF token from the server
 * @returns {Promise<string>} CSRF token
 * @throws {Error} If token fetch fails
 */
export async function fetchCsrfToken() {
    try {
        console.log('🔄 Fetching new CSRF token from server...');

        const response = await fetch(`${API_BASE_URL}/api/csrf-token`, {
            method: 'GET',
            credentials: 'include', // Important: Send cookies with request
            headers: {
                'Content-Type': 'application/json',
            },
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
        throw new Error(`CSRF token fetch failed: ${error.message}`);
    }
}

/**
 * Initialize CSRF token on app startup
 * Checks for existing token in cookies, fetches new one if missing
 * @returns {Promise<string>} CSRF token
 */
export async function initializeCsrfToken() {
    try {
        console.log('🚀 Initializing CSRF protection...');

        // First, check if we already have a valid token in cookies
        const existingToken = getCsrfTokenFromCookie();

        if (existingToken) {
            console.log('♻️ Using existing CSRF token from cookie');
            return existingToken;
        }

        // No token found, fetch a new one
        console.log('🆕 No existing token found, fetching new one...');
        const newToken = await fetchCsrfToken();

        // Verify the token was set in cookies
        setTimeout(() => {
            const verifyToken = getCsrfTokenFromCookie();
            if (verifyToken) {
                console.log('✅ CSRF token successfully initialized and verified');
            } else {
                console.warn('⚠️ CSRF token fetched but not found in cookies');
            }
        }, 100);

        return newToken;

    } catch (error) {
        console.error('❌ Failed to initialize CSRF token:', error);
        throw error;
    }
}

/**
 * Refresh CSRF token (call this after logout or token expiration)
 * @returns {Promise<string>} New CSRF token
 */
export async function refreshCsrfToken() {
    console.log('🔄 Refreshing CSRF token...');
    return await fetchCsrfToken();
}

/**
 * Clear CSRF token from memory (call on logout)
 * Note: Cookie will be cleared by server
 */
export function clearCsrfToken() {
    console.log('🗑️ CSRF token cleared (cookie will be removed by server)');
    // The server handles cookie deletion via res.clearCookie()
    // We just log it here for tracking
}

/**
 * Check if CSRF token exists
 * @returns {boolean} True if token exists in cookies
 */
export function hasCsrfToken() {
    return getCsrfTokenFromCookie() !== null;
}

/**
 * Validate token format (basic check)
 * @param {string} token - Token to validate
 * @returns {boolean} True if token appears valid
 */
export function isValidTokenFormat(token) {
    if (!token || typeof token !== 'string') {
        return false;
    }

    // Token should be 64 hex characters (32 bytes)
    const hexPattern = /^[a-f0-9]{64}$/i;
    return hexPattern.test(token);
}

/**
 * Get token with validation
 * @returns {string|null} Valid token or null
 */
export function getValidatedToken() {
    const token = getCsrfTokenFromCookie();

    if (!token) {
        console.warn('⚠️ No CSRF token available');
        return null;
    }

    if (!isValidTokenFormat(token)) {
        console.error('❌ Invalid CSRF token format:', token.substring(0, 16) + '...');
        return null;
    }

    return token;
}