import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ children, roles }) => {
  const [user] = useAuthState(auth);
  const [userData, loading] = useDocumentData(user ? doc(db, 'users', user.uid) : null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (userData && roles.includes(userData.role)) {
    return children;
  }

  return <Navigate to="/" />;
};

export default RoleBasedRoute;
