export type UserRole = 'user' | 'admin' | 'superadmin' | 'super_admin' | 'company_admin' | 'agent';

export interface Tenant {
  id: string;
  name: string;
}

export interface Company {
    id: string;
    name: string;
}

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  companyId?: string;
  fullName?: string;
  company?: string;
}
