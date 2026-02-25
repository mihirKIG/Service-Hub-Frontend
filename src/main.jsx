import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import AppRouter from './router/AppRouter';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TOAST_CONFIG } from './utils/constants';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <AppRouter />
            <Toaster
              position={TOAST_CONFIG.position}
              toastOptions={{
                duration: TOAST_CONFIG.duration,
                success: TOAST_CONFIG.success,
                error: TOAST_CONFIG.error,
                style: {
                  background: '#fff',
                  color: '#363636',
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
              }}
            />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
