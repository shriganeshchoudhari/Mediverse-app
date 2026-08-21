import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WebGLErrorBoundary from '@/components/WebGLErrorBoundary';

// Component that conditionally throws to test error boundary behavior
const ProblemChild = ({ shouldThrow = true, message = 'WebGL context lost' }: { shouldThrow?: boolean; message?: string }) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>3D Canvas Content</div>;
};

describe('WebGLErrorBoundary Component', () => {
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Suppress console.warn and console.error output during error boundary tests
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test('renders children normally when no error occurs', () => {
    render(
      <WebGLErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </WebGLErrorBoundary>
    );

    expect(screen.getByText('3D Canvas Content')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('renders fallback when error is thrown in child component', () => {
    render(
      <WebGLErrorBoundary>
        <ProblemChild shouldThrow={true} message="WebGL 2.0 context creation failed" />
      </WebGLErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('3D Viewer Unavailable')).toBeInTheDocument();
    expect(screen.getByText(/Your device does not support WebGL/i)).toBeInTheDocument();
    expect(screen.getByText('WebGL 2.0 context creation failed')).toBeInTheDocument();
    expect(screen.queryByText('3D Canvas Content')).not.toBeInTheDocument();
    expect(warnSpy).toHaveBeenCalled();
  });

  test('retryBtn click resets the error state', () => {
    let shouldFail = true;
    const DynamicChild = () => {
      if (shouldFail) {
        throw new Error('Temporary shader compilation error');
      }
      return <div>Recovered 3D Scene</div>;
    };

    const { rerender } = render(
      <WebGLErrorBoundary>
        <DynamicChild />
      </WebGLErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Temporary shader compilation error')).toBeInTheDocument();

    // Recover the child
    shouldFail = false;

    const retryBtn = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(retryBtn);

    expect(screen.getByText('Recovered 3D Scene')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('renders custom fallbackTitle and fallbackDescription when provided', () => {
    render(
      <WebGLErrorBoundary
        fallbackTitle="Custom Medical Model Unavailable"
        fallbackDescription="GPU acceleration is required to display this anatomical model."
      >
        <ProblemChild shouldThrow={true} message="GL_OUT_OF_MEMORY" />
      </WebGLErrorBoundary>
    );

    expect(screen.getByText('Custom Medical Model Unavailable')).toBeInTheDocument();
    expect(
      screen.getByText('GPU acceleration is required to display this anatomical model.')
    ).toBeInTheDocument();
    expect(screen.getByText('GL_OUT_OF_MEMORY')).toBeInTheDocument();
  });
});
