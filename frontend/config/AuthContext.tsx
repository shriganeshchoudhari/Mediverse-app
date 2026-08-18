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
  user: UserProfile | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      try {
        const parts = savedToken.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(window.atob(parts[1]));
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          } else {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
          }
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (e) {
        console.error("Restoration check failed", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: UserProfile) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (token) {
      interval = setInterval(() => {
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(window.atob(parts[1]));
            if (payload.exp && payload.exp * 1000 < Date.now()) {
              logout();
            }
          }
        } catch (e) {
          logout();
        }
      }, 60000); // Check every minute
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
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
