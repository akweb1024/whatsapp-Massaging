
import { createContext, useContext } from 'react';

interface AppConfigContextType {
  isConfigured: boolean;
  loading: boolean;
}

export const AppConfigContext = createContext<AppConfigContextType>({ isConfigured: false, loading: true });

export const useAppConfig = () => useContext(AppConfigContext);
