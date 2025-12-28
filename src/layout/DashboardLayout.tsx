import React from 'react';
import { Box, Toolbar } from '@mui/material';
import AppBar from './AppBar';
import Sidebar from './Sidebar';
import { UserRole } from '../types';

const DashboardLayout: React.FC<{ children: React.ReactNode, userRole: UserRole | null }> = ({ children, userRole }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar handleDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} userRole={userRole} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
