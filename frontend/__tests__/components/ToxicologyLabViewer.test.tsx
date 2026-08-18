import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ToxicologyLabViewer from "../../components/toxicology/ToxicologyLabViewer";

describe("ToxicologyLabViewer Component", () => {
  it("renders with default 5 Core Toxidromes comparator and controls", () => {
    render(<ToxicologyLabViewer initialMode="toxidromes" />);

    expect(screen.getByText(/5 Core Clinical Toxidromes & Poisoning Resuscitation/i)).toBeInTheDocument();
    expect(screen.getByText(/5 Core Toxidrome Comparator/i)).toBeInTheDocument();
    expect(screen.getByText(/Toxicology Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Cholinergic/i).length).toBeGreaterThan(0);
  });

  it("switches to Antidotes mode and displays signature drug overdose engine", () => {
    render(<ToxicologyLabViewer initialMode="toxidromes" />);

    const antiTab = screen.getByText(/2. Drug Antidotes/i);
    fireEvent.click(antiTab);

    expect(screen.getByText(/Signature Overdoses & Antidotes \(APAP, Salicylate, TCA & Digoxin\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Signature Drug Overdoses & Antidotes/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/APAP/i).length).toBeGreaterThan(0);
  });

  it("toggles Toxicology Quiz challenge mode", () => {
    render(<ToxicologyLabViewer initialMode="toxidromes" />);

    const quizBtn = screen.getByText(/Toxicology Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Clinical Toxicology Challenge/i)).toBeInTheDocument();
  });
});
