import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Handle chunk loading errors (stale hashes after redeploy)
window.addEventListener('vite:preloadError', (event) => {
  console.log('Vite preload error detected, reloading...', event);
  window.location.reload();
});

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);