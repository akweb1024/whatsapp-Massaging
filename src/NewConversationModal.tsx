
import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button
} from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { type User } from 'firebase/auth';

interface NewConversationModalProps {
  open: boolean;
  onClose: () => void;
  onStartConversation: (userId: string) => void;
}

const NewConversationModal = ({ open, onClose, onStartConversation }: NewConversationModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (searchTerm) {
      setLoading(true);
      const q = query(collection(db, 'users'), where('email', '>=', searchTerm), where('email', '<=', searchTerm + '\uf8ff'));
      getDocs(q).then((querySnapshot) => {
        const users: User[] = [];
        querySnapshot.forEach((doc) => {
          users.push({ ...doc.data(), uid: doc.id } as User);
        });
        setUsers(users);
        setLoading(false);
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: '#1F2C34', margin: 'auto', mt: '10%', maxWidth: 500, borderRadius: '15px', outline: 'none' }}>
        <Typography variant="h6" component="h2" sx={{color: '#E7E9EA'}}>
          Start a new conversation
        </Typography>
        <Box sx={{display: 'flex', gap: 1, mt: 2, mb: 2}}>
            <TextField
                fullWidth
                label="Search for users by email"
                variant="filled"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                }}
            />
            <Button onClick={handleSearch} variant="contained" color="primary" sx={{borderRadius: '20px'}} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
            </Button>
        </Box>
        <List>
          {users.map((user) => (
            <ListItem key={user.uid} button onClick={() => onStartConversation(user.uid)} sx={{borderRadius: '10px', '&:hover': {backgroundColor: '#3E4A52'}}}>
              <ListItemAvatar>
                <Avatar src={user.photoURL || undefined} />
              </ListItemAvatar>
              <ListItemText primary={user.displayName} secondary={user.email} sx={{color: '#E7E9EA'}}/>
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default NewConversationModal;
