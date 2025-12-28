import { ReactNode, useMemo, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { TenantContext } from './contexts/TenantContext';

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const { user } = useAuth();
  const [tenant] = useState(null);
  const [loading] = useState(false);
  const companyId = useMemo(() => user?.companyId || null, [user]);

  return (
    <TenantContext.Provider value={{ companyId, tenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
};