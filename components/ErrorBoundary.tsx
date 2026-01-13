import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-900 p-4">
          <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <h1 className="text-xl font-bold">System Critical Error</h1>
            </div>
            <p className="text-slate-600 mb-4">
              The application encountered a critical failure. This is a safety fallback to prevent a blank screen.
            </p>
            <div className="bg-slate-100 p-3 rounded text-xs font-mono mb-4 overflow-auto max-h-32">
              {this.state.error?.message || "Unknown error"}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors w-full"
            >
              Reload System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;