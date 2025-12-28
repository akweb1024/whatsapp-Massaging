
import { useState, useEffect, ReactNode } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { AppConfigContext } from './AppConfigContext';

export const AppConfigProvider = ({ children }: { children: ReactNode }) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        // A super admin must exist for the app to be configured
        const superAdminExists = usersSnapshot.docs.some(doc => doc.data().role === 'super_admin');
        setIsConfigured(superAdminExists);
      } catch (error) {
        console.error("Error checking app configuration:", error);
        setIsConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    checkConfiguration();
  }, []);

  return (
    <AppConfigContext.Provider value={{ isConfigured, loading }}>
      {children}
    </AppConfigContext.Provider>
  );
};
