// ✅ AFTER (With CSRF)
import { api, handleResponse } from '../utils/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
    };
};

export const createQr = async (data) => {
    try {
        const response = await api.post(
            '/api/qr',
            data,
            { headers: getAuthHeaders() }
        );
        return await handleResponse(response);
    } catch (err) {
        console.error('Create QR failed:', err);
        throw err;
    }
};

export const getMyQrs = async () => {
    try {
        const response = await api.get(
            '/api/qr',
            { headers: getAuthHeaders() }
        );
        return await handleResponse(response);
    } catch (err) {
        throw err;
    }
};

export const deleteQr = async (id) => {
    try {
        const response = await api.delete(
            `/api/qr/${id}`,
            { headers: getAuthHeaders() }
        );
        return await handleResponse(response);
    } catch (err) {
        throw err;
    }
};