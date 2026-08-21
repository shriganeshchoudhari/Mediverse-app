"use client";
import React, { Component, ReactNode } from 'react';
import styles from './WebGLErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    const isWebGL = error.message?.toLowerCase().includes('webgl') ||
                    error.message?.toLowerCase().includes('context') ||
                    error.message?.toLowerCase().includes('gl_');
    return {
      hasError: true,
      errorMessage: error.message || 'Rendering error'
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn('[WebGLErrorBoundary] caught:', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.fallback} role="alert">
          <div className={styles.icon}>⚠️</div>
          <h3 className={styles.title}>
            {this.props.fallbackTitle || '3D Viewer Unavailable'}
          </h3>
          <p className={styles.description}>
            {this.props.fallbackDescription ||
              'Your device does not support WebGL or encountered a rendering error. Please try on a desktop browser with GPU acceleration enabled.'}
          </p>
          <p className={styles.error}>{this.state.errorMessage}</p>
          <button
            className={styles.retryBtn}
            onClick={() => this.setState({ hasError: false, errorMessage: '' })}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default WebGLErrorBoundary;
