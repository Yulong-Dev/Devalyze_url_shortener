// src/utils/api.js
import {
    getValidatedToken,
    fetchCsrfToken
} from './csrf';

const API_BASE_URL =
    import.meta.env.MODE === "development"
        ? import.meta.env.VITE_API_BASE_URL_DEV
        : import.meta.env.VITE_API_BASE_URL;

/**
 * Main API request function
 */
async function apiRequest(endpoint, options = {}) {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    const method = options.method?.toUpperCase() || 'GET';

    let csrfToken = null;

    // Only attach CSRF for state-changing methods
    if (!safeMethods.includes(method)) {
        csrfToken = getValidatedToken();
        if (!csrfToken) {
            csrfToken = await fetchCsrfToken();
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
        credentials: 'include', // include cookies
    };

    try {
        let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Retry once if CSRF rejected
        if (response.status === 403) {
            const errorData = await response.clone().json().catch(() => null);
            if (errorData?.code?.includes('CSRF')) {
                csrfToken = await fetchCsrfToken();
                if (csrfToken) {
                    config.headers['X-CSRF-Token'] = csrfToken;
                    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
                }
            }
        }

        return response;

    } catch (error) {
        console.error(`❌ API request failed (${method} ${endpoint}):`, error);
        throw error;
    }
}

/**
 * Convenience wrappers
 */
export const api = {
    get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, data, options) => apiRequest(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint, data, options) => apiRequest(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
    patch: (endpoint, data, options) => apiRequest(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
    delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
    request: apiRequest,
};

/**
 * Handle response and throw on errors
 */
export async function handleResponse(response) {
    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
    }
    return response.json();
}

export default api;
