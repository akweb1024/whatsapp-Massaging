import { Navigate } from 'react-router-dom';
import { UserRole } from '../types';

interface RoleBasedRouteProps {
  children: React.ReactElement;
  allowedRoles: UserRole[];
  currentUserRole: UserRole | null;
}

const RoleBasedRoute = ({ children, allowedRoles, currentUserRole }: RoleBasedRouteProps) => {
  if (!currentUserRole) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (allowedRoles.includes(currentUserRole)) {
    return children;
  }

  return <Navigate to="/" />;
};

export default RoleBasedRoute;
