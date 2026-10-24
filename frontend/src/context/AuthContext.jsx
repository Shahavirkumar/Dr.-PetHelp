import React, { createContext, useContext, useState, useEffect } from "react";

import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check existing login session when app starts
  useEffect(() => {
    const checkUser = async () => {
      if (!authService.isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Login
  const login = async ({ email, password }) => {
    setError("");

    try {
      const data = await authService.login({
        email,
        password,
      });

      setUser(data.user);

      return data.user;
    } catch (err) {
      setError(
        err.friendlyMessage || "Invalid email or password."
      );

      throw err;
    }
  };

  // Register
  const register = async ({ name, email, password }) => {
    setError("");

    try {
      const data = await authService.register({
        name,
        email,
        password,
      });

      setUser(data.user);

      return data.user;
    } catch (err) {
      setError(
        err.friendlyMessage || "Could not create account."
      );

      throw err;
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setError("");
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    error,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}