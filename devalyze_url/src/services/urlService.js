// src/services/urlService.js

// Use environment-based API base URL
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000" // Local backend
    : "https://dvilz.onrender.com"; // Render backend

// Helper: Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Create short URL
export const createShortUrl = async (longUrl) => {
  const res = await fetch(`${API_BASE_URL}/shorten`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ longUrl }),
  });
  return res.json();
};

// Get all user URLs
export const getMyUrls = async () => {
  const res = await fetch(`${API_BASE_URL}/my-urls`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return res.json();
};

// Delete a URL
export const deleteUrl = async (id) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return res.json();
};
