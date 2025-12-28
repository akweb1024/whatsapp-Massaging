import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './contexts/AuthProvider';
import { AppConfigProvider } from './contexts/AppConfigProvider';
import { TenantProvider } from './contexts/TenantProvider';

const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppConfigProvider>
          <TenantProvider>
            <App />
          </TenantProvider>
        </AppConfigProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
