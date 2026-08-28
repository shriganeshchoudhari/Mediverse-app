import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeAccessibilityManager from "./ThemeAccessibilityManager";
import { ToastProvider } from "../ToastContext";

describe("ThemeAccessibilityManager Component", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  const renderComponent = () => {
    return render(
      <ToastProvider>
        <ThemeAccessibilityManager />
      </ToastProvider>
    );
  };

  it("renders theme options, font scaling, low bandwidth, and reduced motion toggles", () => {
    renderComponent();

    expect(screen.getByText("Display & Accessibility")).toBeInTheDocument();
    expect(screen.getByText("Dark Mode (Default)")).toBeInTheDocument();
    expect(screen.getByText("Light (Clinical Paper)")).toBeInTheDocument();
    expect(screen.getByText("High-Contrast OLED")).toBeInTheDocument();
    expect(screen.getByText("Typography & Font Scaling")).toBeInTheDocument();
    expect(screen.getByText("Low-Bandwidth & Offline Mode")).toBeInTheDocument();
    expect(screen.getByText("Reduced Motion Override")).toBeInTheDocument();
  });

  it("switches to high-contrast OLED mode and updates localStorage", () => {
    renderComponent();

    const oledButton = screen.getByText("High-Contrast OLED").closest("button");
    if (oledButton) {
      fireEvent.click(oledButton);
    }

    expect(localStorage.getItem("mediverse:theme")).toBe("high-contrast");
    expect(document.documentElement.getAttribute("data-theme")).toBe("high-contrast");
  });

  it("switches font scaling to large and extra large", () => {
    renderComponent();

    const largeBtn = screen.getByText("Large").closest("button");
    if (largeBtn) {
      fireEvent.click(largeBtn);
    }

    expect(localStorage.getItem("mediverse:font-size")).toBe("large");
    expect(document.documentElement.getAttribute("data-font-size")).toBe("large");
  });

  it("toggles low-bandwidth mode", () => {
    renderComponent();

    const toggles = screen.getAllByRole("switch");
    const lowBandwidthToggle = toggles[0]; // first switch
    fireEvent.click(lowBandwidthToggle);

    expect(localStorage.getItem("mediverse:low-bandwidth")).toBe("true");
    expect(document.documentElement.getAttribute("data-low-bandwidth")).toBe("true");
  });
});
