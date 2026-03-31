import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider>
          <NotificationProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AppRouter />
            </BrowserRouter>
          </NotificationProvider>
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
