
import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Grid,
  Button,
  CircularProgress
} from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { useAuth } from './useAuth';
import Login from './Login';
import ConversationList from './ConversationList';
import Messages from './Messages';
import NewConversationModal from './NewConversationModal';
import { doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0B141A',
      paper: '#1F2C34',
    },
    primary: {
      main: '#8643D2', // A nice purple
    },
    text: {
      primary: '#E7E9EA',
      secondary: '#AEB4B7',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1F2C34',
        },
      },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: '25px',
                textTransform: 'none',
                fontWeight: 'bold',
            }
        }
    }
  },
});

function App() {
  const { user, loading } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleStartConversation = async (otherUserId: string) => {
    if (user) {
        const conversationId = [user.uid, otherUserId].sort().join('_');
        const conversationRef = doc(db, "conversations", conversationId);
        const conversationSnap = await getDoc(conversationRef);

        if (!conversationSnap.exists()) {
            await setDoc(conversationRef, {
                createdAt: Timestamp.now(),
                participants: [user.uid, otherUserId],
                lastMessage: "",
            });
        }
        setSelectedConversation(conversationId);
        setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        </ThemeProvider>
    );
  }

  if (!user) {
    return <ThemeProvider theme={darkTheme}><Login /></ThemeProvider>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
        <NewConversationModal 
            open={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onStartConversation={handleStartConversation} 
        />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Chat App
            </Typography>
            <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
          </Toolbar>
        </AppBar>
        <Grid container sx={{ flexGrow: 1, height: 'calc(100vh - 64px)' }}>
          <Grid
            item
            xs={12} sm={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid #3E4A52',
              height: '100%',
              backgroundColor: '#111B21'
            }}
          >
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <ConversationList onSelectConversation={handleSelectConversation} selectedConversationId={selectedConversation} />
            </Box>
            <Box sx={{ p: 2 }}>
              <Button onClick={() => setIsModalOpen(true)} fullWidth variant="contained" color="primary" sx={{py: 1.5}}>
                  New Conversation
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} sx={{ height: '100%' }}>
            {selectedConversation ? (
              <Messages key={selectedConversation} conversationId={selectedConversation} user={user} />
            ) : (
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', textAlign: 'center', p: 3}}>
                    <img src="/undraw_welcoming_re_x0qo.svg" alt="Welcome" style={{width: '70%', maxWidth: '300px', marginBottom: '2rem'}}/>
                    <Typography variant="h4" sx={{mb: 1, fontWeight: 'bold'}}>Welcome to the Chat App</Typography>
                    <Typography variant="body1" sx={{color: 'text.secondary'}}>Select a conversation or start a new one to begin chatting.</Typography>
                </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
