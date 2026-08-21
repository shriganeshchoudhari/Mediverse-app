import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PrakritiAssessmentViewer from '../../components/ayush/PrakritiAssessmentViewer';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>;
  };
});

describe('PrakritiAssessmentViewer', () => {
  it('renders without crashing', () => {
    const { container } = render(<PrakritiAssessmentViewer />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays category tabs (Physical, Physiological, Psychological)', () => {
    render(<PrakritiAssessmentViewer />);
    expect(screen.getByText(/Physical Structure/i)).toBeInTheDocument();
    expect(screen.getByText(/Physiological Function/i)).toBeInTheDocument();
    expect(screen.getByText(/Psychological Traits/i)).toBeInTheDocument();
  });

  it('displays questions with option buttons', () => {
    render(<PrakritiAssessmentViewer />);
    const vataTags = screen.getAllByText(/VATA/i);
    expect(vataTags.length).toBeGreaterThan(0);
  });

  it('Quick fill preset buttons update the dominant Prakriti badge', () => {
    render(<PrakritiAssessmentViewer />);
    const vataBtn = screen.getByText(/Vata Dominant/i);
    fireEvent.click(vataBtn);
    expect(screen.getByText(/Vata Pradhana/i)).toBeInTheDocument();
  });
});
