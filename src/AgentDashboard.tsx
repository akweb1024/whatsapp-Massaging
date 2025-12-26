import { useState } from 'react';
import { Box, Grid } from '@mui/material';
import Conversations from './Conversations';
import Chat from './Chat';

const AgentDashboard = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Conversations onSelectConversation={setSelectedConversation} />
      </Grid>
      <Grid item xs={8}>
        {selectedConversation ? (
          <Chat conversationId={selectedConversation} />
        ) : (
          <Box>Select a conversation to start chatting</Box>
        )}
      </Grid>
    </Grid>
  );
};

export default AgentDashboard;
