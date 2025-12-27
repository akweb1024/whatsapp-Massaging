import { createContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig } from '../types';

export interface AppConfigContextType {
  config: AppConfig | null;
  loading: boolean;
}

export const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

export const AppConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this from a server or a config file.
    const mockConfig: AppConfig = {
      tenants: [
        { id: 'tenant1', name: 'Tenant 1' },
        { id: 'tenant2', name: 'Tenant 2' },
      ]
    };
    setConfig(mockConfig);
    setLoading(false);
  }, []);

  return (
    <AppConfigContext.Provider value={{ config, loading }}>
      {children}
    </AppConfigContext.Provider>
  );
};
