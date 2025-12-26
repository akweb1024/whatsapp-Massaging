import { createContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { AppConfig } from './types';

export interface AppConfigContextType {
  appConfig: AppConfig | null;
  loading: boolean;
}

export const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

interface AppConfigProviderProps {
  children: ReactNode;
}

export const AppConfigProvider = ({ children }: AppConfigProviderProps) => {
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      const configDoc = await getDoc(doc(db, 'config', 'apiCredentials'));
      if (configDoc.exists()) {
        setAppConfig(configDoc.data() as AppConfig);
      } else {
        setAppConfig(null);
      }
      setLoading(false);
    };

    fetchConfig();
  }, []);

  return (
    <AppConfigContext.Provider value={{ appConfig, loading }}>
      {children}
    </AppConfigContext.Provider>
  );
};
