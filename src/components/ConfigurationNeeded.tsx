import { Box, Typography } from '@mui/material';

const ConfigurationNeeded = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h5">
        The application is not yet configured. Please contact the super admin.
      </Typography>
    </Box>
  );
};

export default ConfigurationNeeded;
