import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary to catch React errors and prevent full app crash
 * Used to wrap timeline animation features for graceful degradation
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Timeline Feature Error
          </h2>
          <p className="text-sm text-red-700 mb-2">
            The timeline animation encountered an error and has been disabled.
            The rest of the app is still functional.
          </p>
          {this.state.error && (
            <details className="text-xs text-red-600">
              <summary className="cursor-pointer hover:underline">
                Technical details
              </summary>
              <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
