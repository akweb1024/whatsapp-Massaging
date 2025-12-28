
import { Box, Typography } from '@mui/material';
import CreateUserForm from './components/CreateUserForm';
import UserManagementTable from './components/UserManagementTable';

const SuperAdminDashboard = () => {
  return (
    <Box>
      <Typography variant="h4">Super Admin Dashboard</Typography>
      <CreateUserForm />
      <UserManagementTable />
    </Box>
  );
};

export default SuperAdminDashboard;
