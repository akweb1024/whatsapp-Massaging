import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import DashboardLayout from '../layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserRole } from '../types';

const Dashboard: React.FC = () => {
  const [user] = useAuthState(auth);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const role = (idTokenResult.claims.role as UserRole) || 'user';
        setUserRole(role);
      }
    };
    fetchUserRole();
  }, [user]);

  return (
    <DashboardLayout userRole={userRole}>
      <Box>
        <Typography variant="h4">Welcome to your Dashboard</Typography>
        <Typography paragraph>
          This is a sample dashboard page. You can add any components you want here.
        </Typography>
        {userRole === 'superadmin' && (
          <Button component={Link} to="/users" variant="contained">
            Manage Users
          </Button>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
