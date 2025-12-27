import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './hooks/useAuth';
import Conversations from './Conversations';
import Messages from './Messages';
import { Conversation } from './types';
import { Grid, Paper } from '@mui/material';

const Chat = ({ conversationId }: { conversationId: string }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(conversationId);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Conversation));
      setConversations(convos);
      if (convos.length > 0 && !selectedConversation) {
        setSelectedConversation(convos[0].id);
      }
    });

    return () => unsubscribe();
  }, [user, selectedConversation]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  return (
    <Grid container component={Paper} sx={{ height: 'calc(100vh - 64px)' }}>
      <Grid item xs={4} sx={{ borderRight: '1px solid #ddd' }}>
        <Conversations conversations={conversations} onSelectConversation={handleSelectConversation} />
      </Grid>
      <Grid item xs={8}>
        {selectedConversation ? (
          <Messages conversationId={selectedConversation} />
        ) : (
          <p>Select a conversation to start chatting</p>
        )}
      </Grid>
    </Grid>
  );
};

export default Chat;
