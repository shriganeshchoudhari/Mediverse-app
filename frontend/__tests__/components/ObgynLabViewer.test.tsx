import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ObgynLabViewer from "../../components/obgyn/ObgynLabViewer";

describe("ObgynLabViewer Component", () => {
  it("renders with default WHO Partograph simulator and controls", () => {
    render(<ObgynLabViewer initialMode="partogram" />);

    expect(screen.getByText(/WHO Partograph & Cervical Dilation Labor Progression Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/Modified WHO Partograph & Cervical Dilation Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/OB\/GYN Quiz/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Cardinal Movements of Normal Labor/i).length).toBeGreaterThan(0);
  });

  it("switches to PPH 4Ts mode and updates uterotonic cascade", () => {
    render(<ObgynLabViewer initialMode="partogram" />);

    const pphTab = screen.getByText(/2. PPH & Uterotonics/i);
    fireEvent.click(pphTab);

    expect(screen.getByText(/Postpartum Hemorrhage 4Ts & Stepwise Uterotonic Escalation Cascade/i)).toBeInTheDocument();
    expect(screen.getByText(/PPH 4Ts & Algorithmic Uterotonic Escalation Cascade/i)).toBeInTheDocument();
  });

  it("toggles OB/GYN Quiz challenge mode", () => {
    render(<ObgynLabViewer initialMode="partogram" />);

    const quizBtn = screen.getByText(/OB\/GYN Quiz/i);
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Exit Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Obstetrics & Gynecology Clinical Case Challenge/i)).toBeInTheDocument();
  });
});
