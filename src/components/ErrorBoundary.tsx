'use client';

import React, { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

// Enhanced error types for better categorization
type ErrorCategory = 'network' | 'runtime' | 'chunk' | 'unknown';

// Define interfaces for ErrorBoundary
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
  errorCategory: ErrorCategory;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  showErrorDetails?: boolean;
  isolate?: boolean; // Whether to isolate this boundary from parent boundaries
}

interface ErrorFallbackProps {
  error?: Error;
  errorCategory?: ErrorCategory;
  retryCount?: number;
  maxRetries?: number;
  resetError?: () => void;
  onReportError?: () => void;
}

interface EnhancedErrorInfo extends ErrorInfo {
  errorBoundary?: string;
  timestamp?: string;
  userAgent?: string;
  url?: string;
}

/**
 * Enhanced Error Boundary component with better error categorization,
 * retry functionality, and comprehensive error reporting
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      errorCategory: 'unknown',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Categorize the error
    const errorCategory = ErrorBoundary.categorizeError(error);

    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId,
      errorCategory,
    };
  }

  static categorizeError(error: Error): ErrorCategory {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    // Network errors
    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('load') ||
      message.includes('timeout')
    ) {
      return 'network';
    }

    // Code splitting/chunk errors
    if (message.includes('chunk') || message.includes('loading chunk') || stack.includes('chunk')) {
      return 'chunk';
    }

    // Runtime errors
    if (
      message.includes('cannot read') ||
      message.includes('undefined') ||
      message.includes('null') ||
      message.includes('reference')
    ) {
      return 'runtime';
    }

    return 'unknown';
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Enhanced error logging
    const enhancedErrorInfo: EnhancedErrorInfo = {
      ...errorInfo,
      errorBoundary: this.constructor.name,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    };

    console.group('🚨 ErrorBoundary caught an error');
    console.error('Error:', error);
    console.error('Error Info:', enhancedErrorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    this.setState({
      error,
      errorInfo: enhancedErrorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Report to error tracking service
    this.reportError(error, enhancedErrorInfo);
  }

  private reportError = (error: Error, errorInfo: EnhancedErrorInfo): void => {
    // Google Analytics error reporting
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `${error.name}: ${error.message}`,
        fatal: false,
        error_category: this.state.errorCategory,
        error_id: this.state.errorId,
      });
    }

    // Console error for development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error reported:', {
        error: error.toString(),
        errorInfo,
        errorId: this.state.errorId,
        category: this.state.errorCategory,
      });
    }

    // Here you could integrate with services like Sentry, LogRocket, etc.
    // Example:
    // Sentry.captureException(error, {
    //   tags: { errorBoundary: true, category: this.state.errorCategory },
    //   extra: errorInfo
    // });
  };

  private handleRetry = (): void => {
    const { maxRetries = 3 } = this.props;

    if (this.state.retryCount >= maxRetries) {
      console.warn('Max retries reached, redirecting to home');
      window.location.href = '/';
      return;
    }

    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));

    // For chunk errors, try to reload the page after a short delay
    if (this.state.errorCategory === 'chunk') {
      this.retryTimeoutId = setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  private handleReportBug = (): void => {
    const errorReport = {
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      errorInfo: this.state.errorInfo,
      errorId: this.state.errorId,
      category: this.state.errorCategory,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Here you could open a bug report form or send to support

    // Example: Open mailto with error details
    const subject = encodeURIComponent(`Bug Report: ${this.state.error?.name || 'Error'}`);
    const body = encodeURIComponent(`Error Details:\n${JSON.stringify(errorReport, null, 2)}`);
    window.open(`mailto:support@renewedapp.com?subject=${subject}&body=${body}`);
  };

  componentWillUnmount(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { maxRetries = 3 } = this.props;
      const canRetry = this.state.retryCount < maxRetries;

      return (
        <SacredCard variant="solid" className="my-6 border-l-4 border-l-red-500 p-8">
          <div className="text-center">
            {/* Error Icon and Header */}
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <h3 className="mb-2 text-xl font-semibold text-gray-900">{this.getErrorTitle()}</h3>

            <p className="mx-auto mb-6 max-w-md text-gray-600">{this.getErrorMessage()}</p>

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              {canRetry && (
                <SacredButton
                  variant="primary"
                  onClick={this.handleRetry}
                  className="flex items-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again{' '}
                  {this.state.retryCount > 0 && `(${this.state.retryCount}/${maxRetries})`}
                </SacredButton>
              )}

              <SacredButton
                variant="ghost"
                onClick={this.handleGoHome}
                className="flex items-center"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </SacredButton>

              <SacredButton
                variant="ghost"
                onClick={this.handleReportBug}
                className="flex items-center text-sm"
              >
                <Bug className="mr-2 h-4 w-4" />
                Report Issue
              </SacredButton>
            </div>

            {/* Error ID for support */}
            {this.state.errorId && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500">
                  Error ID:{' '}
                  <code className="rounded bg-gray-100 px-2 py-1 font-mono">
                    {this.state.errorId}
                  </code>
                </p>
              </div>
            )}

            {/* Development Error Details */}
            {(process.env.NODE_ENV === 'development' || this.props.showErrorDetails) &&
              this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-600 transition-colors hover:text-gray-800">
                    🔧 Error Details (Development)
                  </summary>
                  <div className="mt-3 rounded-lg border bg-gray-50 p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="mb-1 text-sm font-semibold text-gray-700">Error:</h4>
                        <pre className="overflow-auto rounded bg-red-50 p-2 text-xs text-red-700">
                          {this.state.error.toString()}
                        </pre>
                      </div>

                      {this.state.error.stack && (
                        <div>
                          <h4 className="mb-1 text-sm font-semibold text-gray-700">Stack Trace:</h4>
                          <pre className="max-h-32 overflow-auto rounded bg-gray-100 p-2 text-xs text-gray-600">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}

                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <h4 className="mb-1 text-sm font-semibold text-gray-700">
                            Component Stack:
                          </h4>
                          <pre className="max-h-32 overflow-auto rounded bg-gray-100 p-2 text-xs text-gray-600">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="font-semibold text-gray-700">Category:</span>
                          <span className="ml-2 rounded bg-blue-100 px-2 py-1 text-blue-800">
                            {this.state.errorCategory}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Retries:</span>
                          <span className="ml-2">
                            {this.state.retryCount}/{maxRetries}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </details>
              )}
          </div>
        </SacredCard>
      );
    }

    return this.props.children;
  }

  private getErrorTitle(): string {
    switch (this.state.errorCategory) {
      case 'network':
        return 'Connection Problem';
      case 'chunk':
        return 'Loading Issue';
      case 'runtime':
        return 'Something Went Wrong';
      default:
        return 'Unexpected Error';
    }
  }

  private getErrorMessage(): string {
    switch (this.state.errorCategory) {
      case 'network':
        return "We're having trouble connecting to our servers. Please check your internet connection and try again.";
      case 'chunk':
        return "We're having trouble loading some resources. This might be due to a recent update. Refreshing the page should fix this.";
      case 'runtime':
        return 'A technical error occurred while processing your request. Our team has been notified.';
      default:
        return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
    }
  }
}

/**
 * Higher-order component to wrap components with ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Hook to create error boundary in functional components
 */
export function useErrorBoundary() {
  return {
    captureError: (error: Error, errorInfo?: ErrorInfo) => {
      // This would need to be implemented with a custom hook that
      // can throw errors to the nearest error boundary
      console.error('Error captured by useErrorBoundary:', error, errorInfo);
      throw error;
    },
  };
}

/**
 * Enhanced error fallback components using Sacred Journey design system
 */
export const SacredErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorCategory,
  retryCount = 0,
  maxRetries = 3,
  resetError,
  onReportError,
}) => (
  <SacredCard variant="glass" className="p-6 text-center">
    <div className="mb-4">
      <AlertTriangle className="mx-auto mb-2 h-12 w-12 text-red-500" />
      <h3 className="mb-1 text-lg font-semibold text-sacred-blue-900">Content Unavailable</h3>
      <p className="text-sm text-sacred-blue-600">
        {errorCategory === 'network' ? 'Connection issue detected' : 'Temporary loading problem'}
      </p>
    </div>

    <div className="space-y-3">
      {resetError && retryCount < maxRetries && (
        <SacredButton variant="primary" onClick={resetError} size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again {retryCount > 0 && `(${retryCount}/${maxRetries})`}
        </SacredButton>
      )}

      {onReportError && (
        <SacredButton variant="ghost" onClick={onReportError} size="sm">
          <Bug className="mr-2 h-4 w-4" />
          Report Issue
        </SacredButton>
      )}
    </div>
  </SacredCard>
);

export const MinimalErrorFallback: React.FC = () => (
  <div className="flex items-center justify-center py-8 text-sacred-blue-600">
    <AlertTriangle className="mr-2 h-5 w-5" />
    <span className="text-sm">Content temporarily unavailable</span>
  </div>
);

export const InlineErrorFallback: React.FC<{ message?: string }> = ({
  message = 'Unable to load content',
}) => (
  <div className="inline-flex items-center rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
    <AlertTriangle className="mr-2 h-4 w-4" />
    {message}
  </div>
);

/**
 * Async error boundary for handling promise rejections
 */
export class AsyncErrorBoundary extends ErrorBoundary {
  componentDidMount() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
    super.componentWillUnmount();
  }

  private handlePromiseRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);

    // Convert promise rejection to error
    const error = new Error(
      event.reason instanceof Error ? event.reason.message : String(event.reason)
    );

    // Trigger error boundary
    this.setState({
      hasError: true,
      error,
      errorInfo: {
        componentStack: 'Promise rejection in async operation',
      } as ErrorInfo,
      errorId: `async_error_${Date.now()}`,
      errorCategory: 'network',
      retryCount: 0,
    });

    // Prevent default browser handling
    event.preventDefault();
  };
}

/**
 * Route-level error boundary with navigation context
 */
export const RouteErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, ...props }) => (
  <ErrorBoundary
    {...props}
    onError={(error, errorInfo) => {
      // Add route-specific error handling
      console.error('Route-level error:', {
        error,
        errorInfo,
        route: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      });

      props.onError?.(error, errorInfo);
    }}
  >
    {children}
  </ErrorBoundary>
);

// Export all types and utilities
export type {
  ErrorBoundaryProps,
  ErrorFallbackProps,
  ErrorBoundaryState,
  ErrorCategory,
  EnhancedErrorInfo,
};

// Utility function to create error boundaries with specific configurations
export const createErrorBoundary = (config: Partial<ErrorBoundaryProps> = {}) => {
  const ErrorBoundaryWrapper = ({ children }: { children: ReactNode }) => (
    <ErrorBoundary {...config}>{children}</ErrorBoundary>
  );

  ErrorBoundaryWrapper.displayName = 'ErrorBoundaryWrapper';
  return ErrorBoundaryWrapper;
};

// Pre-configured error boundaries for common use cases
export const NetworkErrorBoundary = createErrorBoundary({
  maxRetries: 5,
  onError: (error) => console.warn('Network operation failed:', error),
});

export const ComponentErrorBoundary = createErrorBoundary({
  maxRetries: 2,
  isolate: true,
});

export const PageErrorBoundary = createErrorBoundary({
  maxRetries: 1,
  showErrorDetails: process.env.NODE_ENV === 'development',
});
