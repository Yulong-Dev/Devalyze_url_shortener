// src/services/pageService.js

const API_BASE_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:5000/api"
        : "https://dvilz.onrender.com/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

/**
 * Save or update user's page
 */
export const savePage = async (pageData) => {
    try {
        const res = await fetch(`${API_BASE_URL}/pages`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(pageData),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || data.message || "Failed to save page");
        }

        return data;
    } catch (error) {
        console.error("Save page error:", error);
        throw error;
    }
};

/**
 * Get logged-in user's page
 */
export const getMyPage = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/pages/my-page`, {
            headers: getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || data.message || "Failed to fetch page");
        }

        return data;
    } catch (error) {
        console.error("Get my page error:", error);
        throw error;
    }
};

/**
 * Check if username is available
 */
export const checkUsername = async (username) => {
    try {
        const res = await fetch(
            `${API_BASE_URL}/pages/check-username/${username}`,
            {
                headers: getAuthHeaders(),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || data.message || "Failed to check username");
        }

        return data;
    } catch (error) {
        console.error("Check username error:", error);
        throw error;
    }
};

/**
 * Get public page by username (no auth needed)
 */
export const getPublicPage = async (username) => {
    try {
        const res = await fetch(`${API_BASE_URL}/pages/u/${username}`);

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || data.message || "Page not found");
        }

        return data;
    } catch (error) {
        console.error("Get public page error:", error);
        throw error;
    }
};

/**
 * Delete user's page
 */
export const deletePage = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/pages/my-page`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || data.message || "Failed to delete page");
        }

        return data;
    } catch (error) {
        console.error("Delete page error:", error);
        throw error;
    }
};

/**
 * Get page statistics
 */
export const getPageStats = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/pages/stats`, {
            headers: getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || data.message || "Failed to fetch stats");
        }

        return data;
    } catch (error) {
        console.error("Get page stats error:", error);
        throw error;
    }
};