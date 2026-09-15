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

/** Set HttpOnly cookie via the server-side API route (XSS-safe). */
async function setServerCookie(token: string): Promise<void> {
  try {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  } catch {
    // Non-critical: in-memory token still available
  }
}

/** Clear the HttpOnly cookie via the server-side API route. */
async function clearServerCookie(): Promise<void> {
  try {
    await fetch("/api/auth/session", { method: "DELETE" });
  } catch {
    // Non-critical
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    // Keep refreshToken in localStorage only — access token removed for security
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    // Clear in-memory access token
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    // Clear the HttpOnly cookie asynchronously
    clearServerCookie();
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
          // Store access token in HttpOnly cookie (not localStorage)
          await setServerCookie(data.token);
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
    const savedRefreshToken = localStorage.getItem("refreshToken");
    const savedUser = localStorage.getItem("user");

    // Access token is stored in HttpOnly cookie — we check for user + refreshToken
    // to determine if a session exists, then refresh to get a usable in-memory token
    if (savedRefreshToken && savedUser) {
      try {
        setRefreshToken(savedRefreshToken);
        setUser(JSON.parse(savedUser));
        // Attempt silent refresh to hydrate the in-memory token
        refreshAccessToken().finally(() => setLoading(false));
        return;
      } catch (e) {
        console.error("Session restoration failed", e);
        logout();
      }
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (newToken: string, newUser: UserProfile, newRefreshToken?: string) => {
    // Store only non-sensitive data in localStorage
    localStorage.setItem("user", JSON.stringify(newUser));
    // Access token goes into HttpOnly cookie (async, fire-and-forget)
    setServerCookie(newToken);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
