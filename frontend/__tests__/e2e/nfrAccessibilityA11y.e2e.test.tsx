import React from "react";
import { render, screen } from "@testing-library/react";
import { ClinicalPg12LabViewer } from "@/components/pg12/ClinicalPg12LabViewer";
import { ClinicalPg11LabViewer } from "@/components/pg11/ClinicalPg11LabViewer";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/config/AuthContext";

describe("E2E Non-Functional: Accessibility (WCAG 2.1 AA) & Semantic ARIA Structure (NFR-A11Y)", () => {
  test("NFR-A11Y-001: Navbar provides semantic navigation and accessible brand links", () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    // Semantic navigation landmark
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();

    // Brand link with accessible name
    const brandLink = screen.getByRole("link", { name: /Mediverse/i });
    expect(brandLink).toBeInTheDocument();
  });

  test("NFR-A11Y-002: Clinical Lab Viewers provide interactive buttons with descriptive text", () => {
    render(<ClinicalPg12LabViewer />);

    // All tabs must be rendered as accessible buttons
    const tabButtons = screen.getAllByRole("button");
    expect(tabButtons.length).toBeGreaterThanOrEqual(5);

    tabButtons.forEach(btn => {
      expect(btn).not.toHaveTextContent(/^$/); // Must not have empty accessible names
    });
  });

  test("NFR-A11Y-003: Clinical sliders provide input range semantics with min and max bounds", () => {
    render(<ClinicalPg11LabViewer />);

    const sliders = screen.getAllByRole("slider");
    expect(sliders.length).toBeGreaterThan(0);

    sliders.forEach(slider => {
      expect(slider).toHaveAttribute("min");
      expect(slider).toHaveAttribute("max");
    });
  });
});
