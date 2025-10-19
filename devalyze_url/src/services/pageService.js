// ✅ Add this import at the top
import { api, handleResponse } from '../utils/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
    };
};

// ✅ Update savePage function
export const savePage = async (pageData) => {
    try {
        const response = await api.post(
            '/pages',
            pageData,
            { headers: getAuthHeaders() }
        );
        return await handleResponse(response);
    } catch (error) {
        console.error("Save page error:", error);
        throw error;
    }
};

// ✅ Update getMyPage function
export const getMyPage = async () => {
    try {
        const response = await api.get(
            '/pages/my-page',
            { headers: getAuthHeaders() }
        );
        return await handleResponse(response);
    } catch (error) {
        console.error("Get my page error:", error);
        throw error;
    }
};

// ✅ Update checkUsername function
export const checkUsername = async (username) => {
    try {
        const response = await api.get(
            `/pages/check-username/${username}`,
            { headers: getAuthHeaders() }
        );
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};

// ✅ Update getPublicPage function (NO AUTH NEEDED)
export const getPublicPage = async (username) => {
    try {
        const response = await api.get(`/pages/u/${username}`);
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};

// ✅ Update deletePage function
export const deletePage = async () => {
    try {
        const response = await api.delete(
            '/pages/my-page',
            { headers: getAuthHeaders() }
        );
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};

// ✅ Update getPageStats function
export const getPageStats = async () => {
    try {
        const response = await api.get(
            '/pages/stats',
            { headers: getAuthHeaders() }
        );
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};