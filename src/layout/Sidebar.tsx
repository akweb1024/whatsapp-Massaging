import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Toolbar, Box } from '@mui/material';
import { UserRole } from '../types';

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  userRole: UserRole | null;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle, userRole }) => {
  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem button component={RouterLink} to="/">
          <ListItemText primary="Dashboard" />
        </ListItem>
        {userRole === 'superadmin' && (
          <>
            <ListItem button component={RouterLink} to="/users">
              <ListItemText primary="Users" />
            </ListItem>
            <ListItem button component={RouterLink} to="/settings">
              <ListItemText primary="Settings" />
            </ListItem>
          </>
        )}
        <ListItem button component={RouterLink} to="/companies">
          <ListItemText primary="Companies" />
        </ListItem>
        <ListItem button component={RouterLink} to="/chat">
          <ListItemText primary="Chat" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Temporary Drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      {/* Permanent Drawer for desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
