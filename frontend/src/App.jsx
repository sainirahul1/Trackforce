import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import GlobalLoader from './components/GlobalLoader';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <GlobalLoader />
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
