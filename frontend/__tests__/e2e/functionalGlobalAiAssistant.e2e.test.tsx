import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GlobalSocraticAssistant from "@/components/ai/GlobalSocraticAssistant";
import { usePathname } from "next/navigation";

// Mock next/navigation usePathname
jest.mock("next/navigation", () => ({
  usePathname: jest.fn()
}));

// Mock SocraticChat child component
jest.mock("@/components/ai/SocraticChat", () => {
  return function MockSocraticChat(props: { currentChapterId?: string; topicTitle: string }) {
    return (
      <div data-testid="socratic-chat">
        <span data-testid="chat-topic">{props.topicTitle}</span>
        <span data-testid="chat-chapter">{props.currentChapterId}</span>
      </div>
    );
  };
});

describe("E2E Functional: Global Socratic AI Assistant & Context Adaptation (FR-AI)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("E2E-AI-001: Renders Floating Action Button (FAB) and opens Socratic drawer on click", () => {
    (usePathname as jest.Mock).mockReturnValue("/simulators/renal-filtration");

    render(<GlobalSocraticAssistant />);

    // FAB should be visible and not expanded initially
    const fabButton = screen.getByRole("button", { name: /Open AI Socratic Tutor/i });
    expect(fabButton).toBeInTheDocument();
    expect(fabButton).toHaveAttribute("aria-expanded", "false");

    // Click to open drawer
    fireEvent.click(fabButton);

    // FAB is now expanded
    expect(fabButton).toHaveAttribute("aria-expanded", "true");

    // Drawer header should display adapted context
    expect(screen.getAllByText(/Renal Filtration & Glomerular Dynamics/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("socratic-chat")).toBeInTheDocument();
    expect(screen.getByTestId("chat-topic")).toHaveTextContent("Renal Filtration & Glomerular Dynamics");
    expect(screen.getByTestId("chat-chapter")).toHaveTextContent("renal-filtration");
  });

  test("E2E-AI-002: Contextually adapts topic title based on active page route", () => {
    (usePathname as jest.Mock).mockReturnValue("/exam");

    render(<GlobalSocraticAssistant />);

    // Open drawer
    fireEvent.click(screen.getByRole("button", { name: /Open AI Socratic Tutor/i }));

    expect(screen.getAllByText(/Clinical Examination & OSCE Prep/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("chat-chapter")).toHaveTextContent("exam");
  });

  test("E2E-AI-003: Closes the drawer when close button or backdrop overlay is triggered", () => {
    (usePathname as jest.Mock).mockReturnValue("/curriculum");

    render(<GlobalSocraticAssistant />);

    // Open drawer
    const fabButton = screen.getByRole("button", { name: /Open AI Socratic Tutor/i });
    fireEvent.click(fabButton);
    expect(fabButton).toHaveAttribute("aria-expanded", "true");

    // Click close button
    const closeBtn = screen.getByRole("button", { name: /Close AI Socratic Tutor/i });
    fireEvent.click(closeBtn);

    // FAB aria-expanded is updated to false
    expect(fabButton).toHaveAttribute("aria-expanded", "false");
  });
});
