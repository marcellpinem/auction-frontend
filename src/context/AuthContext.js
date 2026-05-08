// auction-frontend/src/context/AuthContext.js
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "@/lib/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const setToken = useCallback((token) => {
    setAccessToken(token);
    if (typeof window !== "undefined") {
      window.__accessToken__ = token;
    }
  }, []);

  const login = useCallback(
    (token, userData) => {
      setToken(token);
      setUser(userData);
    },
    [setToken],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      setToken(null);
      setUser(null);
    }
  }, [setToken]);

  const updateUser = useCallback((userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  }, []);

  // Coba refresh token saat pertama load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        setToken(data.data.accessToken);
        setUser(data.data.user);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [setToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!accessToken,
        isEmailVerified: user?.isEmailVerified ?? false,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
