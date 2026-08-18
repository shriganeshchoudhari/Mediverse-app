"use client";

import React from "react";
import { AuthProvider } from "../config/AuthContext";
import Navbar from "./Navbar";
import { ToastProvider } from "./ToastContext";



export default function ClientProviders({ children }: { children: React.ReactNode }) {


  return (
    <ToastProvider>
      <AuthProvider>
        <Navbar />
        {children}
      </AuthProvider>
    </ToastProvider>
  );
}
