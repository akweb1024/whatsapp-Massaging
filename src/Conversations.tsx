import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { List, ListItem, ListItemText } from '@mui/material';
import { Conversation } from './types';

interface ConversationsProps {
  onSelectConversation: (conversationId: string) => void;
}

const Conversations = ({ onSelectConversation }: ConversationsProps) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (user && user.companyId) {
      const q = query(
        collection(db, 'conversations'),
        where('companyId', '==', user.companyId),
        // where('agentId', '==', user.uid) // This will be enabled later
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const convos: Conversation[] = [];
        querySnapshot.forEach((doc) => {
          convos.push({ ...doc.data(), id: doc.id } as Conversation);
        });
        setConversations(convos);
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <List>
      {conversations.map((convo) => (
        <ListItem button key={convo.id} onClick={() => onSelectConversation(convo.id)}>
          <ListItemText primary={convo.customerName} secondary={convo.lastMessage} />
        </ListItem>
      ))}
    </List>
  );
};

export default Conversations;
