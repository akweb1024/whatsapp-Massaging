import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
} from '@mui/material';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [language, setLanguage] = useState(user?.language || 'en');

  const handleUpdate = async () => {
    if (user) {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { name, language });
      setUser({ ...user, name, language });
      alert('Settings updated successfully');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Settings</Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Language</InputLabel>
          <Select
            value={language}
            label="Language"
            onChange={(e) => setLanguage(e.target.value)}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleUpdate} sx={{ mt: 2 }}>
          Save Settings
        </Button>
      </Paper>
    </Box>
  );
};

export default Settings;
