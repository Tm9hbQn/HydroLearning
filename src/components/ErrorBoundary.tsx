import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-6 text-center" dir="rtl">
          <h1 className="text-3xl font-bold text-red-600 mb-4">אופס! משהו השתבש.</h1>
          <p className="text-slate-700 mb-6 max-w-lg">
            מצטערים, נתקלנו בשגיאה לא צפויה. נסה לרענן את העמוד או לחזור מאוחר יותר.
          </p>
          <div className="bg-white p-4 rounded shadow text-left ltr overflow-auto max-w-full text-xs text-slate-500">
            {this.state.error?.message}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
          >
            רענן את העמוד
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
