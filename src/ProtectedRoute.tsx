import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { UserRole } from './types';

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: UserRole[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />; // Or a custom unauthorized page
  }

  return children;
};

export default ProtectedRoute;
