import { Box, Typography, Paper, Grid } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import ApiSettings from './ApiSettings';

const CompanyAdminDashboard = () => {
  const { user } = useAuth();

  if (user?.role !== 'company_admin') {
    return <Typography>You do not have permission to view this page.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Company Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <ApiSettings />
          </Paper>
        </Grid>
        {/* Add other admin-specific components here */}
      </Grid>
    </Box>
  );
};

export default CompanyAdminDashboard;
