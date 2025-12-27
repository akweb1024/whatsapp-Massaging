import { useState, useEffect, ReactNode } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { AppConfigContext, AppConfigContextType } from './contexts/AppConfigContext';

interface AppConfigProviderProps {
  children: ReactNode;
}

export const AppConfigProvider = ({ children }: AppConfigProviderProps) => {
  const [appConfig, setAppConfig] = useState<AppConfigContextType | null>(null);

  useEffect(() => {
    const fetchAppConfig = async () => {
      const configDoc = await getDoc(doc(db, 'appConfig', 'config'));
      if (configDoc.exists()) {
        const data = configDoc.data();
        setAppConfig({ tenants: [], ...data, id: configDoc.id } as AppConfigContextType);
      }
    };
    fetchAppConfig();
  }, []);

  return (
    <AppConfigContext.Provider value={appConfig!}>
      {children}
    </AppConfigContext.Provider>
  );
};
