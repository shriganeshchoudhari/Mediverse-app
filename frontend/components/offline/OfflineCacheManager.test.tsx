import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OfflineCacheManager from "./OfflineCacheManager";
import { ToastProvider } from "../ToastContext";

describe("OfflineCacheManager Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <ToastProvider>
        <OfflineCacheManager />
      </ToastProvider>
    );
  };

  it("renders offline cache monitor, pre-cache button, simulate offline button, and storage KPI metrics", () => {
    renderComponent();

    expect(screen.getByText("Offline Cache & PWA Storage")).toBeInTheDocument();
    expect(screen.getByText(/Pre-cache All Curriculum & Flashcards/i)).toBeInTheDocument();
    expect(screen.getByText("Simulate Offline Mode")).toBeInTheDocument();
    expect(screen.getByText("Clear Offline Cache")).toBeInTheDocument();
    expect(screen.getByText("19 MBBS Curriculum Catalogs")).toBeInTheDocument();
    expect(screen.getByText("Spaced Repetition Flashcards (SM-2)")).toBeInTheDocument();
  });

  it("toggles offline simulation mode", () => {
    renderComponent();

    const simBtn = screen.getByText("Simulate Offline Mode");
    fireEvent.click(simBtn);

    expect(localStorage.getItem("mediverse:simulate-offline")).toBe("true");
    expect(screen.getByText("Simulated Offline Mode Active")).toBeInTheDocument();
  });
});
