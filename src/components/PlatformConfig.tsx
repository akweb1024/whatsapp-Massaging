import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Box, Button, TextField, Typography } from '@mui/material';

const PlatformConfig = () => {
  const navigate = useNavigate();
  const [apiCredentials, setApiCredentials] = useState({ openAIKey: '', googleAIKey: '' });

  useEffect(() => {
    const fetchConfig = async () => {
      const configDoc = await getDoc(doc(db, 'config', 'apiCredentials'));
      if (configDoc.exists()) {
        setApiCredentials(configDoc.data() as { openAIKey: string, googleAIKey: string });
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    await setDoc(doc(db, 'config', 'apiCredentials'), apiCredentials);
    navigate('/');
  };

  return (
    <Box>
      <Typography variant="h4">Platform Configuration</Typography>
      <TextField
        label="OpenAI API Key"
        fullWidth
        margin="normal"
        value={apiCredentials.openAIKey}
        onChange={(e) => setApiCredentials({ ...apiCredentials, openAIKey: e.target.value })}
      />
      <TextField
        label="Google AI API Key"
        fullWidth
        margin="normal"
        value={apiCredentials.googleAIKey}
        onChange={(e) => setApiCredentials({ ...apiCredentials, googleAIKey: e.target.value })}
      />
      <Button onClick={handleSave} variant="contained" sx={{ mt: 2 }}>
        Save
      </Button>
    </Box>
  );
};

export default PlatformConfig;
