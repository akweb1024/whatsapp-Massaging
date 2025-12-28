
import { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../types';

export interface AuthContextType {
  user: (User & { fbUser: FirebaseUser }) | null;
  loading: boolean;
  logout: () => void;
  login: () => void;
  setUser: Dispatch<SetStateAction<(User & { fbUser: FirebaseUser }) | null>>;
}

export const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  logout: () => {}, 
  login: () => {},
  setUser: () => {}
});

export const useAuth = () => useContext(AuthContext);
