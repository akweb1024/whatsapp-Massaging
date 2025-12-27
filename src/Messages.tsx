import { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  where 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { useAuth } from './hooks/useAuth';
import { Message } from './types';
import { 
  Box, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Typography, 
  Avatar,
  Grid,
  Divider
} from '@mui/material';
import UploadButton from './UploadButton';

interface MessagesProps {
  conversationId: string;
}

const Messages = ({ conversationId }: MessagesProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Message));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      sender: user?.id,
      conversationId,
      timestamp: serverTimestamp()
    });

    setNewMessage('');
  };

  const handleUpload = async (file: File) => {
    if (!conversationId) return;

    const storageRef = ref(storage, `attachments/${conversationId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    await addDoc(collection(db, "messages"), {
      attachment: downloadURL,
      sender: user?.id,
      conversationId,
      timestamp: serverTimestamp()
    });
  };

  return (
    <Paper sx={{ p: 3, height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Chat</Typography>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
        <List>
          {messages.map(msg => (
            <ListItem key={msg.id} sx={{ justifyContent: msg.sender === user?.id ? 'flex-end' : 'flex-start' }}>
              <Box sx={{ 
                bgcolor: msg.sender === user?.id ? 'primary.main' : 'grey.300', 
                color: msg.sender === user?.id ? 'primary.contrastText' : 'inherit',
                p: 1,
                borderRadius: 2,
                maxWidth: '70%'
              }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <Avatar sx={{ width: 30, height: 30 }}>{/* User avatar logic here */}</Avatar>
                  </Grid>
                  <Grid item>
                    {msg.text && <ListItemText primary={msg.text} />}
                    {msg.attachment && (
                      <a href={msg.attachment} target="_blank" rel="noopener noreferrer">
                        <img src={msg.attachment} alt="attachment" width="200" />
                      </a>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <UploadButton onUpload={handleUpload} />
        <Button variant="contained" onClick={handleSendMessage} sx={{ ml: 1 }}>Send</Button>
      </Box>
    </Paper>
  );
};

export default Messages;
