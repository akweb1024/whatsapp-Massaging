import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { User } from './types';

type Props = {
  children: JSX.Element;
  allowedRoles: User['role'][];
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
