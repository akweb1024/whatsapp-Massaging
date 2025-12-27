import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { Conversation } from './types';

interface ConversationsProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
}

const Conversations = ({ conversations, onSelectConversation }: ConversationsProps) => {
  return (
    <div>
      <Typography variant="h6">Conversations</Typography>
      <List>
        {conversations.map((conv) => (
          <ListItem button key={conv.id} onClick={() => onSelectConversation(conv.id)}>
            <ListItemText primary={`Conversation with ${conv.participants.join(', ')}`} secondary={conv.lastMessage} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Conversations;
