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
    error: null
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8 text-center" dir="rtl">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md border border-red-100">
            <h1 className="text-2xl font-black text-red-600 mb-4">אופס! משהו השתבש.</h1>
            <p className="text-slate-600 mb-6">האפליקציה נתקלה בשגיאה לא צפויה.</p>
            {this.state.error && (
              <pre className="text-left text-xs bg-slate-100 p-4 rounded-lg overflow-auto max-h-40 mb-6 text-red-500" dir="ltr">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-700 transition w-full"
            >
              רענן את הדף
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
