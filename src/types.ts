
export interface Company {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'company_admin' | 'agent';
  companyId: string;
  language?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: any;
  attachment?: string;
}

export interface AppConfig {
  tenants: any[]; 
}

export interface Conversation {
    id: string;
    participants: string[];
    lastMessage: string;
}

export type UserRole = 'super_admin' | 'company_admin' | 'agent';
