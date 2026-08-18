import React from 'react';
import { render, screen } from '@testing-library/react';
import QuizScoreChart from '../../components/dashboard/QuizScoreChart';

// Mock recharts to avoid rendering issues in JSDOM
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    LineChart: () => <div>LineChart Mock</div>,
  };
});

describe('QuizScoreChart', () => {
  it('renders the chart title', () => {
    render(<QuizScoreChart data={[]} />);
    expect(screen.getByText(/Quiz Performance/i)).toBeInTheDocument();
  });
});
