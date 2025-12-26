export type UserRole = 'super_admin' | 'company_admin' | 'agent';

export interface User {
  id: string;
  uid: string;
  email: string;
  role: UserRole;
  companyId: string;
  company?: string;
  profile?: any;
  status?: 'active' | 'inactive';
  userData?: any;
}

export interface Company {
  id: string;
  name: string;
  maxUsers: number;
  maxConversations: number;
}

export interface Conversation {
  id: string;
  customerName: string;
  lastMessage: string;
  companyId: string;
  agentId?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: any;
}

export interface AppConfig {
  id: string;
  [key: string]: any;
}