// devalyze_url/src/utils/api.js

/**
 * API Request Wrapper with CSRF Protection
 * Automatically includes CSRF tokens in all state-changing requests
 */

import {
    getCsrfTokenFromCookie,
    fetchCsrfToken,
    isValidTokenFormat
} from './csrf';

// Get API base URL from environment
const API_BASE_URL =
    import.meta.env.MODE === "development"
        ? import.meta.env.VITE_API_BASE_URL_DEV
        : import.meta.env.VITE_API_BASE_URL;

/**
 * Make an API request with automatic CSRF token handling
 * @param {string} endpoint - API endpoint (e.g., '/api/url/shorten')
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export async function apiRequest(endpoint, options = {}) {
    // Methods that don't need CSRF protection
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    const method = options.method?.toUpperCase() || 'GET';

    // Get CSRF token if this is a state-changing request
    let csrfToken = null;

    if (!safeMethods.includes(method)) {
        // Try to get token from cookie first
        csrfToken = getCsrfTokenFromCookie();

        // If no token or invalid format, fetch a new one
        if (!csrfToken || !isValidTokenFormat(csrfToken)) {
            console.log('🔄 No valid CSRF token found, fetching new one...');
            try {
                csrfToken = await fetchCsrfToken();
            } catch (error) {
                console.error('❌ Failed to fetch CSRF token:', error);
                throw new Error('CSRF token unavailable. Please refresh the page.');
            }
        }
    }

    // Build headers
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Add CSRF token header for state-changing requests
    if (csrfToken && !safeMethods.includes(method)) {
        defaultHeaders['X-CSRF-Token'] = csrfToken;
        console.log(`✅ Added CSRF token to ${method} request:`, csrfToken.substring(0, 16) + '...');
    }

    // Merge with user-provided headers
    const headers = {
        ...defaultHeaders,
        ...options.headers,
    };

    // Build final config
    const config = {
        ...options,
        headers,
        credentials: 'include', // Always include cookies
    };

    // Make the request
    try {
        console.log(`📡 ${method} ${endpoint}`);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Handle CSRF token errors (403 with CSRF error codes)
        if (response.status === 403) {
            try {
                const errorData = await response.clone().json();

                // Check if this is a CSRF-related error
                if (errorData.code && errorData.code.includes('CSRF')) {
                    console.warn('⚠️ CSRF token rejected, fetching new token...');

                    // Fetch a fresh token
                    await fetchCsrfToken();
                    const newToken = getCsrfTokenFromCookie();

                    if (newToken && isValidTokenFormat(newToken)) {
                        console.log('🔄 Retrying request with new CSRF token...');

                        // Update headers with new token
                        config.headers['X-CSRF-Token'] = newToken;

                        // Retry the request once
                        return fetch(`${API_BASE_URL}${endpoint}`, config);
                    }
                }
            } catch (parseError) {
                // If we can't parse the error, just return the original response
                console.error('❌ Failed to parse 403 error:', parseError);
            }
        }

        return response;

    } catch (error) {
        console.error(`❌ API request failed (${method} ${endpoint}):`, error);
        throw error;
    }
}

/**
 * Convenience wrapper for GET requests
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export async function get(endpoint, options = {}) {
    return apiRequest(endpoint, {
        ...options,
        method: 'GET',
    });
}

/**
 * Convenience wrapper for POST requests
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export async function post(endpoint, data, options = {}) {
    return apiRequest(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * Convenience wrapper for PUT requests
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export async function put(endpoint, data, options = {}) {
    return apiRequest(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

/**
 * Convenience wrapper for PATCH requests
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export async function patch(endpoint, data, options = {}) {
    return apiRequest(endpoint, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

/**
 * Convenience wrapper for DELETE requests
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export async function del(endpoint, options = {}) {
    return apiRequest(endpoint, {
        ...options,
        method: 'DELETE',
    });
}

/**
 * API object with all HTTP methods
 * Usage: api.post('/api/url/shorten', { longUrl: 'https://example.com' })
 */
export const api = {
    get,
    post,
    put,
    patch,
    delete: del,
    request: apiRequest,
};

/**
 * Helper to handle API response errors
 * @param {Response} response - Fetch response
 * @returns {Promise<any>} Parsed JSON data
 * @throws {Error} If response is not ok
 */
export async function handleResponse(response) {
    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
            // If we can't parse JSON, use the status text
        }

        throw new Error(errorMessage);
    }

    return response.json();
}

/**
 * Example usage with error handling
 *
 * try {
 *   const response = await api.post('/api/url/shorten', {
 *     longUrl: 'https://example.com'
 *   });
 *   const data = await handleResponse(response);
 *   console.log('Success:', data);
 * } catch (error) {
 *   console.error('Error:', error.message);
 * }
 */

export default api;