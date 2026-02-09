import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import './lib/i18n';

// Register Chart.js components if needed later, but for now just basic render
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Failed to find the root element');
  document.body.innerHTML = '<div style="color: red; padding: 20px;"><h1>Critical Error</h1><p>Failed to find the root element. Application cannot start.</p></div>';
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>,
    );
  } catch (error) {
    console.error('Failed to render the app:', error);
    rootElement.innerHTML = `<div style="color: red; padding: 20px;"><h1>Startup Error</h1><p>${error instanceof Error ? error.message : String(error)}</p></div>`;
  }
}
