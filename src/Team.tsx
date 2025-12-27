import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './hooks/useAuth';
import { User } from './types';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Avatar, 
  ListItemAvatar 
} from '@mui/material';

const Team = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState<User[]>([]);

  useEffect(() => {
    if (user?.companyId) {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('companyId', '==', user.companyId));
      getDocs(q).then(snapshot => {
        setTeam(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User)));
      });
    }
  }, [user]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Our Team</Typography>
      <Paper sx={{ p: 3 }}>
        <List>
          {team.map(member => (
            <ListItem key={member.id}>
              <ListItemAvatar>
                <Avatar>{member.name.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={member.name} secondary={member.email} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Team;
