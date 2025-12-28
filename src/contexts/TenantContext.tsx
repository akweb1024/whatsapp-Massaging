
import { createContext } from 'react';
import { Tenant } from '../types';

export interface TenantContextProps {
  tenant: Tenant | null;
  loading: boolean;
  companyId?: string | null;
}

export const TenantContext = createContext<TenantContextProps | undefined>(
  undefined
);
