import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface Props {
  handleDrawerToggle: () => void;
  mobileOpen: boolean;
}

const CustomAppBar = ({ handleDrawerToggle }: Props) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          My App
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
