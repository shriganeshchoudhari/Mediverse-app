"use client";

import React, { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Clinical Workspace Uncaught Error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  handleNavigateHome = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[50vh] flex items-center justify-center p-6"
        >
          <div className="max-w-lg w-full bg-slate-900/90 border border-rose-500/30 rounded-xl p-6 shadow-2xl backdrop-blur-md text-slate-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-rose-300">Clinical Workspace Exception</h2>
                <p className="text-xs text-slate-400">WebGL or Interactive Simulation Runtime Error</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              An unexpected condition occurred while rendering this clinical scenario or 3D simulation module. Patient safety state and cached session records remain preserved.
            </p>

            {this.state.error && (
              <details className="mb-5 bg-slate-950/80 rounded-lg p-3 border border-slate-800 text-xs font-mono text-rose-300/80">
                <summary className="cursor-pointer text-slate-400 hover:text-slate-200">
                  Technical Diagnostics
                </summary>
                <p className="mt-2 whitespace-pre-wrap break-all text-[11px] text-slate-400">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </details>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                Reload Simulation
              </button>
              <button
                type="button"
                onClick={this.handleNavigateHome}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors focus:ring-2 focus:ring-slate-400 focus:outline-none"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
