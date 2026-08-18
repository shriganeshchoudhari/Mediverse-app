import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AetcomLabViewer from "../../components/aetcom/AetcomLabViewer";

describe("AetcomLabViewer Component", () => {
  it("renders with default 4 Principles & CURB capacity evaluator", () => {
    render(<AetcomLabViewer initialMode="fourPrinciples" />);

    expect(screen.getByText(/The 4 Principles of Bioethics & Decision-Making Capacity \(CURB\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Decision-Making Capacity Checklist \(CURB Criteria\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Ethics Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Capacity/i).length).toBeGreaterThan(0);
  });

  it("switches to SPIKES mode and updates step buttons", () => {
    render(<AetcomLabViewer initialMode="fourPrinciples" />);

    const spikesTab = screen.getByText(/2. SPIKES & NURSE Empathy/i);
    fireEvent.click(spikesTab);

    expect(screen.getByText(/The SPIKES Protocol for Delivering Bad News & NURSE Empathy Framework/i)).toBeInTheDocument();
    expect(screen.getByText(/The SPIKES 6-Step Protocol Simulator/i)).toBeInTheDocument();
  });

  it("toggles Ethics Quiz challenge mode", () => {
    render(<AetcomLabViewer initialMode="fourPrinciples" />);

    const quizBtn = screen.getByText(/Ethics Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Medical Ethics Challenge/i)).toBeInTheDocument();
  });
});
