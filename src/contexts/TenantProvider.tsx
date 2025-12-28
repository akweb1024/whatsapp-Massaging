
import { useState, useEffect, ReactNode } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { Tenant } from '../types';
import { TenantContext } from './TenantContext';

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const companyId = user?.companyId;

  useEffect(() => {
    const fetchTenant = async () => {
      if (companyId) {
        const companyDocRef = doc(db, 'companies', companyId);
        const docSnap = await getDoc(companyDocRef);
        if (docSnap.exists()) {
          setTenant(docSnap.data() as Tenant);
        }
      }
      setLoading(false);
    };

    fetchTenant();
  }, [companyId]);

  return (
    <TenantContext.Provider value={{ tenant, loading, companyId }}>
      {children}
    </TenantContext.Provider>
  );
};
