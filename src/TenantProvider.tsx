import { createContext, useContext } from 'react';
import { useAuth } from './useAuth';

interface TenantContextType {
  companyId: string | null;
}

const TenantContext = createContext<TenantContextType>({ companyId: null });

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const { userData } = useAuth();

  return (
    <TenantContext.Provider value={{ companyId: userData?.companyId || null }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
