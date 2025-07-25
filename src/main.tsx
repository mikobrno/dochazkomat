import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Completely disable any Sentry functionality
if (typeof window !== 'undefined') {
  // Block Sentry completely
  window.Sentry = undefined;
  
  // Override any Sentry globals
  (window as any).__SENTRY__ = undefined;
  (window as any).sentryWrapped = undefined;
  
  // Block console errors from Sentry
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;
  
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('Sentry') || 
        message.includes('getReplayId') || 
        message.includes('sentryWrapped') ||
        message.includes('debug-logger') ||
        message.includes('instrumentation') ||
        message.includes('bundle.tracing')) {
      return;
    }
    originalError.apply(console, args);
  };
  
  console.warn = (...args) => {
    const message = args.join(' ');
    if (message.includes('Sentry') || 
        message.includes('getReplayId') || 
        message.includes('sentryWrapped') ||
        message.includes('debug-logger') ||
        message.includes('instrumentation') ||
        message.includes('bundle.tracing')) {
      return;
    }
    originalWarn.apply(console, args);
  };
  
  console.log = (...args) => {
    const message = args.join(' ');
    if (message.includes('Sentry') || 
        message.includes('getReplayId') || 
        message.includes('sentryWrapped') ||
        message.includes('debug-logger') ||
        message.includes('instrumentation') ||
        message.includes('bundle.tracing')) {
      return;
    }
    originalLog.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);