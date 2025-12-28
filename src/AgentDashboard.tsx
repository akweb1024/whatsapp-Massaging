
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { useTenant } from './hooks/useTenant';
import { 
  Box, Typography, TextField, Button, List, ListItem, ListItemText, Paper, 
  Divider, Avatar, ListItemAvatar, ListItemButton 
} from '@mui/material';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface Message {
  id: string;
  from: string;
  to?: string;
  text: string;
  timestamp: Timestamp;
  direction: 'inbound' | 'outbound';
}

const AgentDashboard = () => {
  const { tenant } = useTenant();
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const functions = getFunctions();
  const sendMessage = httpsCallable(functions, 'sendMessage');

  useEffect(() => {
    if (tenant) {
      const q = query(
        collection(db, 'companies', tenant.id, 'messages'),
        orderBy('timestamp', 'asc')
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs: Message[] = [];
        querySnapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() } as Message);
        });

        const convos = msgs.reduce((acc, msg) => {
          const key = msg.direction === 'inbound' ? msg.from : msg.to;
          if (key) {
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(msg);
          }
          return acc;
        }, {} as Record<string, Message[]>);

        setConversations(convos);

        if (!selectedConversation && Object.keys(convos).length > 0) {
          const firstConvo = Object.keys(convos)[0];
          setSelectedConversation(firstConvo);
          setRecipient(firstConvo);
        }
      });

      return () => unsubscribe();
    }
  }, [tenant, selectedConversation]);

  const handleSelectConversation = (phoneNumber: string) => {
    setSelectedConversation(phoneNumber);
    setRecipient(phoneNumber);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || recipient.trim() === '' || !tenant) return;

    try {
      await sendMessage({ companyId: tenant.id, to: recipient, text: newMessage });
      await addDoc(collection(db, 'companies', tenant.id, 'messages'), {
        from: 'me',
        text: newMessage,
        timestamp: serverTimestamp(),
        direction: 'outbound',
        to: recipient,
      });
      setNewMessage('');
      if (!selectedConversation) {
        setSelectedConversation(recipient);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
      <Box sx={{ width: '30%', borderRight: '1px solid #ccc' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #ccc' }}>
            <Typography variant="h6">Conversations</Typography>
        </Box>
        <List component="nav">
          {Object.entries(conversations).map(([phoneNumber, msgs]) => (
            <ListItemButton 
              key={phoneNumber} 
              selected={selectedConversation === phoneNumber}
              onClick={() => handleSelectConversation(phoneNumber)}
            >
              <ListItemAvatar>
                <Avatar>{phoneNumber.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={phoneNumber} 
                secondary={msgs.length > 0 ? msgs[msgs.length - 1].text : ''}
                sx={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ flex: 1, p: 2, overflowY: 'auto', boxShadow: 'none' }}>
            {selectedConversation ? (
                <List>
                    {(conversations[selectedConversation] || []).map((msg) => (
                    <ListItem key={msg.id} sx={{ justifyContent: msg.direction === 'outbound' ? 'flex-end' : 'flex-start' }}>
                        <ListItemText 
                        primary={msg.text} 
                        secondary={new Date(msg.timestamp?.toDate()).toLocaleTimeString()} 
                        sx={{ 
                            bgcolor: msg.direction === 'outbound' ? '#e1ffc7' : '#f1f1f1',
                            borderRadius: '10px',
                            p: 1,
                            maxWidth: '60%',
                        }} 
                        />
                    </ListItem>
                    ))}
                </List>
            ) : (
                <Box sx={{textAlign: 'center', mt: 4}}>
                    <Typography variant="h6">Select a conversation to start messaging</Typography>
                </Box>
            )}
        </Paper>
        <Divider />
        <Box sx={{ p: 2, display: 'flex', gap: 2, background: '#f7f7f7' }}>
           <TextField
            label={selectedConversation ? `Replying to ${selectedConversation}` : "New recipient phone number"}
            variant="outlined"
            fullWidth
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={!!selectedConversation}
          />
          <TextField
            label="Type a message"
            variant="outlined"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={!recipient}
          />
          <Button variant="contained" onClick={handleSendMessage} disabled={!recipient || !newMessage}>Send</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AgentDashboard;
