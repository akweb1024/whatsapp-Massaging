import { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  Paper,
  Typography,
  Avatar
} from '@mui/material';
import { db } from './firebase'; // Make sure this path is correct
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  updateDoc, 
  arrayUnion
} from 'firebase/firestore';
import UploadButton from './UploadButton';
import { User } from 'firebase/auth';
import DoneAllIcon from '@mui/icons-material/DoneAll';

interface Message {
  id: string;
  content: string;
  senderType: 'agent' | 'customer';
  timestamp: Timestamp;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'media';
  uid: string; // User ID of the sender
  readBy: string[];
}

interface MessagesProps {
  conversationId: string;
  user: User | null; // Pass user from App.tsx
}

const Messages = ({ conversationId, user }: MessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: Message[] = [];
      querySnapshot.forEach((doc) => {
        const message = { id: doc.id, ...doc.data() } as Message;
        messagesData.push(message);

        if (user && message.uid !== user.uid && !message.readBy.includes(user.uid)) {
            const messageRef = doc.ref;
            updateDoc(messageRef, {
                readBy: arrayUnion(user.uid)
            });
        }
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [conversationId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() !== '' && conversationId && user) {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      await addDoc(messagesRef, {
        content: inputValue,
        senderType: 'customer',
        timestamp: Timestamp.now(),
        status: 'sent',
        type: 'text',
        uid: user.uid,
        readBy: [user.uid],
      });
      setInputValue('');
    }
  };

  const handleUploadComplete = async (url: string) => {
    if (conversationId && user) {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      await addDoc(messagesRef, {
        content: url,
        senderType: 'customer',
        timestamp: Timestamp.now(),
        status: 'sent',
        type: 'media',
        uid: user.uid,
        readBy: [user.uid],
      });
    }
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.type === 'media') {
      return (
        <Box
          component="img"
          src={msg.content}
          alt="Media message"
          sx={{
            maxWidth: '100%',
            maxHeight: '300px',
            borderRadius: '10px',
            mt: 1,
          }}
        />
      );
    }
    return <Typography variant="body1">{msg.content}</Typography>;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, backgroundColor: '#0B141A' }}>
      <Paper elevation={0} sx={{ flexGrow: 1, overflowY: 'auto', p: 2, mb: 2, backgroundColor: 'transparent' }}>
        <List>
          {messages.map((msg) => {
            const isSender = msg.uid === user?.uid;
            const isRead = msg.readBy.length > 1;
            return (
              <ListItem key={msg.id} sx={{ display: 'flex', justifyContent: isSender ? 'flex-end' : 'flex-start', p: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1}}>
                    {!isSender && <Avatar sx={{ width: 24, height: 24 }} />}
                    <Paper
                    elevation={1}
                    sx={{
                        p: '10px 16px',
                        borderRadius: isSender ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                        backgroundColor: isSender ? '#005C4B' : '#3E4A52',
                        color: 'white',
                        maxWidth: '70%',
                    }}
                    >
                    {renderMessageContent(msg)}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#B0B0B0', mr: 0.5 }}>
                            {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        {isSender && <DoneAllIcon fontSize="small" sx={{ color: isRead ? '#53BDEB' : '#B0B0B0' }} />}
                    </Box>
                    </Paper>
                </Box>
              </ListItem>
            );
          })}
           <div ref={messagesEndRef} />
        </List>
      </Paper>
      <Box
        component="form"
        sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, backgroundColor: '#1F2C34' }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <UploadButton onUploadComplete={handleUploadComplete} />
        <TextField
          fullWidth
          variant="filled"
          placeholder="Type a message"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={!conversationId}
          sx={{
            '& .MuiFilledInput-root': {
                borderRadius: '20px',
                backgroundColor: '#3E4A52',
                '&:hover': {
                    backgroundColor: '#3E4A52',
                },
                '&.Mui-focused': {
                    backgroundColor: '#3E4A52',
                }
            },
            '& .MuiFilledInput-input': {
                color: 'white',
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default Messages;
