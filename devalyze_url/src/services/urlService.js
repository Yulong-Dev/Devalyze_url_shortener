
import { api, handleResponse } from '../utils/api'; // ✅ NEW: Import API wrapper

// ✅ Helper: Get auth token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
    };
};

/**
 * Create short URL
 * @param {string} longUrl - The URL to shorten
 * @returns {Promise<Object>} Response with short URL
 */
export const createShortUrl = async (longUrl) => {
    try {
        // ✅ NEW: Using api.post instead of raw fetch
        const response = await api.post(
            '/shorten',
            { longUrl },
            { headers: getAuthHeaders() } // Auth token still needed
        );

        return await handleResponse(response);
    } catch (error) {
        console.error('❌ Create short URL failed:', error);
        throw error;
    }
};

/**
 * Get all user URLs
 * @returns {Promise<Array>} Array of URL objects
 */
export const getMyUrls = async () => {
    try {
        // ✅ GET requests don't need CSRF tokens, but we use api.get for consistency
        const response = await api.get(
            '/my-urls',
            { headers: getAuthHeaders() }
        );

        return await handleResponse(response);
    } catch (error) {
        console.error('❌ Get URLs failed:', error);
        throw error;
    }
};

/**
 * Delete a URL
 * @param {string} id - URL ID to delete
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteUrl = async (id) => {
    try {
        // ✅ NEW: Using api.delete instead of raw fetch
        const response = await api.delete(
            `/${id}`,
            { headers: getAuthHeaders() }
        );

        return await handleResponse(response);
    } catch (error) {
        console.error('❌ Delete URL failed:', error);
        throw error;
    }
};

/**
 * Update a URL
 * @param {string} id - URL ID to update
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated URL object
 */
export const updateUrl = async (id, data) => {
    try {
        // ✅ NEW: Using api.put for updates
        const response = await api.put(
            `/${id}`,
            data,
            { headers: getAuthHeaders() }
        );

        return await handleResponse(response);
    } catch (error) {
        console.error('❌ Update URL failed:', error);
        throw error;
    }
};

