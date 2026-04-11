import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { GoogleMapsProvider } from './context/GoogleMapsContext';
import { DialogProvider } from './context/DialogContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider>
          <NotificationProvider>
            <DialogProvider>
              <GoogleMapsProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <AppRouter />
                </BrowserRouter>
              </GoogleMapsProvider>
            </DialogProvider>
          </NotificationProvider>
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
