// src/services/qrService.js

const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000" // Local backend
    : "https://dvilz.onrender.com"; // Render backend

// Helper: get token from localStorage
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ✅ Create a QR code
export const createQr = async (data) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/qr`, {
      method: "POST",
      headers: getAuthConfig(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Create QR failed: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Create QR failed:", err.message);
    throw err;
  }
};

// ✅ Fetch all QR codes for logged-in user
export const getMyQrs = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/qr`, {
      headers: getAuthConfig(),
    });

    if (!res.ok) {
      throw new Error(`Fetch QRs failed: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch QRs failed:", err.message);
    throw err;
  }
};

// ✅ Delete a QR code by ID
export const deleteQr = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/qr/${id}`, {
      method: "DELETE",
      headers: getAuthConfig(),
    });

    if (!res.ok) {
      throw new Error(`Delete QR failed: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Delete QR failed:", err.message);
    throw err;
  }
};
