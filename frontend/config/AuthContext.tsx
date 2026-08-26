"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  login: (token: string, user: UserProfile, refreshToken?: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    const savedRefreshToken = localStorage.getItem("refreshToken");
    if (!savedRefreshToken) {
      logout();
      return false;
    }

    try {
      const response = await fetch("/api/v1/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: savedRefreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken);
            setRefreshToken(data.refreshToken);
          }
          return true;
        }
      }
      logout();
      return false;
    } catch (e) {
      console.warn("Silent token refresh failed", e);
      return false;
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRefreshToken = localStorage.getItem("refreshToken");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        const parts = savedToken.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(window.atob(parts[1]));
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            // Token expired, attempt refresh
            if (savedRefreshToken) {
              refreshAccessToken();
            } else {
              logout();
            }
          } else {
            setToken(savedToken);
            setRefreshToken(savedRefreshToken || null);
            setUser(JSON.parse(savedUser));
          }
        } else {
          logout();
        }
      } catch (e) {
        console.error("Restoration check failed", e);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: UserProfile, newRefreshToken?: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);

    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
      setRefreshToken(newRefreshToken);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (token) {
      interval = setInterval(() => {
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(window.atob(parts[1]));
            // If token expires in less than 5 minutes, refresh proactively
            if (payload.exp && payload.exp * 1000 - Date.now() < 300000) {
              refreshAccessToken();
            }
          }
        } catch (e) {
          console.warn("Proactive token check error", e);
        }
      }, 60000); // Check every minute
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [token, refreshToken]);

  return (
    <AuthContext.Provider value={{ token, refreshToken, user, login, logout, refreshAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
