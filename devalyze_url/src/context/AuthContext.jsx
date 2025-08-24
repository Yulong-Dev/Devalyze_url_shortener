import React, { createContext, useState, useEffect } from "react";
import { isTokenExpired, getUserFromToken } from "../utils/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if token exists in localStorage when app loads
    const savedToken = localStorage.getItem("token");
    if (savedToken && !isTokenExpired(savedToken)) {
      setToken(savedToken);
      setUser(getUserFromToken(savedToken));
    } else {
      localStorage.removeItem("token");
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(getUserFromToken(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
