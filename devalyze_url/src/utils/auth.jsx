import { jwtDecode } from "jwt-decode";

// Check if token is expired
export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true; // if no expiry, treat as expired

    const currentTime = Date.now() / 1000; // in seconds
    return decoded.exp < currentTime;
  } catch (error) {
    return true; // if token can't be decoded, treat as expired
  }
};

// Get user from token if valid
export const getUserFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    return null;
  }
};

