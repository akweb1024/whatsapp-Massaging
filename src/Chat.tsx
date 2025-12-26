import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { Message } from './types';

interface ChatProps {
  conversationId: string;
}

const Chat = ({ conversationId }: ChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const messagesCollection = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesCollection, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ ...doc.data(), id: doc.id } as Message);
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !user) return;

    const messagesCollection = collection(db, 'conversations', conversationId, 'messages');
    await addDoc(messagesCollection, {
      text: newMessage,
      sender: user.uid,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  return (
    <Paper elevation={3} sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((msg) => (
          <Box key={msg.id} sx={{ textAlign: msg.sender === user?.uid ? 'right' : 'left', mb: 1 }}>
            <Typography variant="caption" color="textSecondary">
              {msg.sender}
            </Typography>
            <Box
              sx={{
                display: 'inline-block',
                p: 1,
                borderRadius: 2,
                bgcolor: msg.sender === user?.uid ? 'secondary.main' : 'grey.300',
                color: msg.sender === user?.uid ? 'white' : 'black',
              }}
            >
              {msg.text}
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 2, borderTop: '1px solid #ccc' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} variant="contained" sx={{ mt: 1 }}>
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default Chat;
