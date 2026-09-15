"use client";

import React, { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "../lib/queryClient";
import { AuthProvider } from "../config/AuthContext";
import Navbar from "./Navbar";
import { ToastProvider } from "./ToastContext";
import WebVitals from "./WebVitals";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  // Initialize user accessibility, theme, and low-bandwidth settings on mount
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const root = document.documentElement;

      // 1. Theme
      const savedTheme = localStorage.getItem("mediverse:theme");
      if (savedTheme === "light" || savedTheme === "high-contrast" || savedTheme === "dark") {
        root.setAttribute("data-theme", savedTheme);
        root.classList.remove("theme-dark", "theme-light", "theme-high-contrast");
        root.classList.add(`theme-${savedTheme}`);
      }

      // 2. Font Size
      const savedFontSize = localStorage.getItem("mediverse:font-size");
      if (savedFontSize === "large") {
        root.setAttribute("data-font-size", "large");
        root.style.fontSize = "115%";
      } else if (savedFontSize === "xlarge") {
        root.setAttribute("data-font-size", "xlarge");
        root.style.fontSize = "130%";
      } else if (savedFontSize === "standard") {
        root.setAttribute("data-font-size", "standard");
        root.style.fontSize = "100%";
      }

      // 3. Reduced Motion
      const savedReducedMotion = localStorage.getItem("mediverse:reduced-motion");
      if (savedReducedMotion === "true") {
        root.setAttribute("data-reduced-motion", "true");
        root.classList.add("reduce-motion");
      }

      // 4. Low-Bandwidth
      const savedLowBandwidth = localStorage.getItem("mediverse:low-bandwidth");
      if (savedLowBandwidth === "true") {
        root.setAttribute("data-low-bandwidth", "true");
      }

      // 5. Offline Simulation sync
      const sim = localStorage.getItem("mediverse:simulate-offline") === "true";
      (window as any).__MEDIVERSE_OFFLINE_SIMULATION = sim;
    } catch (e) {
      console.warn("Client accessibility initialization warning:", e);
    }
  }, []);

  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <Navbar />
          {children}
          <WebVitals />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
