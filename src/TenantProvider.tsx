import { ReactNode, useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import { TenantContext } from './contexts/TenantContext';

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const { user } = useAuth();
  const companyId = useMemo(() => user?.companyId || null, [user]);

  return (
    <TenantContext.Provider value={{ companyId }}>
      {children}
    </TenantContext.Provider>
  );
};