import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './AuthContext';
import { AppConfigProvider } from './AppConfigContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppConfigProvider>
        <App />
      </AppConfigProvider>
    </AuthProvider>
  </StrictMode>,
);
