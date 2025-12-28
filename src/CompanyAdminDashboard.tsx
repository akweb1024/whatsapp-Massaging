
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const CompanyAdminDashboard = () => {

  return (
    <Box>
      <Typography variant="h4">Company Admin Dashboard</Typography>
      <Button component={Link} to="/settings">Company Settings</Button>
    </Box>
  );
};

export default CompanyAdminDashboard;
