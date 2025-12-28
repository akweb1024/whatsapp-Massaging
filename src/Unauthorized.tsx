
import { Box, Typography } from '@mui/material';

const Unauthorized = () => {
  return (
    <Box>
      <Typography variant="h4">Unauthorized</Typography>
      <Typography>You do not have permission to view this page.</Typography>
    </Box>
  );
};

export default Unauthorized;
