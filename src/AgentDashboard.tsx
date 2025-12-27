import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import Chat from './Chat';

const AgentDashboard = () => {
  const { user } = useAuth();

  if (user?.role !== 'agent') {
    return <Typography>You do not have permission to view this page.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Agent Dashboard</Typography>
      <Paper sx={{ p: 3 }}>
        <Chat conversationId='1' />
      </Paper>
    </Box>
  );
};

export default AgentDashboard;
