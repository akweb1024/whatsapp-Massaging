
import { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Container,
  TextField,
  Toolbar,
  Typography,
  CssBaseline,
  Paper,
  List,
  ListItem,
  ListItemText,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { db } from './firebase'; // Make sure this path is correct
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';

// Define a theme for the app
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    primary: {
      main: '#00A884', // WhatsApp green
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1F2C34', // Darker header
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#3E4A52',
            },
            '&:hover fieldset': {
              borderColor: '#00A884',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00A884',
            },
          },
        },
      },
    },
  },
});

interface Message {
  id: string;
  content: string;
  senderType: 'agent' | 'customer';
  timestamp: Timestamp;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'media';
}

const CONVERSATION_ID = 'dev_conversation'; // Hardcoded for development

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const messagesRef = collection(db, 'conversations', CONVERSATION_ID, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: Message[] = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim() !== '') {
      const messagesRef = collection(db, 'conversations', CONVERSATION_ID, 'messages');
      await addDoc(messagesRef, {
        content: inputValue,
        senderType: 'customer', // Assuming the user is the customer
        timestamp: Timestamp.now(),
        status: 'sent',
        type: 'text',
      });
      setInputValue('');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              WhatsApp Messaging
            </Typography>
          </Toolbar>
        </AppBar>
        <Container
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            py: 2,
          }}
        >
          <Paper elevation={3} sx={{ flexGrow: 1, overflowY: 'auto', p: 2, mb: 2 }}>
            <List>
              {messages.map((msg) => (
                <ListItem key={msg.id}>
                  <ListItemText
                    primary={msg.content}
                    secondary={msg.timestamp?.toDate().toLocaleTimeString()}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Box
            component="form"
            sx={{ display: 'flex' }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
