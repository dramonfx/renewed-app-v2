
'use client';

import React, { ReactNode, ErrorInfo } from 'react';

// Define interfaces for ErrorBoundary
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Prevents entire page crashes when individual components fail
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // You can also log the error to an error reporting service here
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4">
          <div className="flex items-center mb-4">
            <div className="text-red-500 text-xl mr-3">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800">
              Something went wrong
            </h3>
          </div>
          
          <p className="text-red-700 mb-4">
            We encountered an error while loading this content. Please try refreshing the page.
          </p>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
          >
            Refresh Page
          </button>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer text-red-600 font-medium">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 p-3 bg-red-100 rounded text-red-800 overflow-auto text-xs">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook version of ErrorBoundary for functional components
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>, 
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P): React.ReactElement {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * Simple error fallback components
 */
export const SimpleErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <div className="text-center py-8">
    <div className="text-red-500 text-4xl mb-4">😵</div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      Oops! Something went wrong
    </h3>
    <p className="text-gray-600 mb-4">
      We&apos;re having trouble loading this content.
    </p>
    {resetError && (
      <button
        onClick={resetError}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
      >
        Try Again
      </button>
    )}
  </div>
);

export const MinimalErrorFallback: React.FC = () => (
  <div className="text-center py-4 text-gray-500">
    <span className="text-2xl">⚠️</span>
    <p className="text-sm mt-2">Content temporarily unavailable</p>
  </div>
);

// Export prop types for external use
export type { ErrorBoundaryProps, ErrorFallbackProps, ErrorBoundaryState };
