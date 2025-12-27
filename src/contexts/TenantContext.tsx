import { createContext } from 'react';

interface TenantContextType {
  companyId: string | null;
}

export const TenantContext = createContext<TenantContextType>({ companyId: null });