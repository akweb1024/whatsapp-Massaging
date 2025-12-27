
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Box, Typography, Paper, Grid, TextField, Button } from '@mui/material';

const PlatformConfig = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      const docRef = doc(db, 'platform', 'config');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const config = docSnap.data();
        setApiKey(config.apiKey || '');
        setApiUrl(config.apiUrl || '');
      }
    };
    fetchConfig();
  }, []);

  const handleSaveConfig = async () => {
    const docRef = doc(db, 'platform', 'config');
    await setDoc(docRef, { apiKey, apiUrl }, { merge: true });
    alert('Configuration saved!');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Platform Configuration</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <TextField
            label="WhatsApp API URL"
            fullWidth
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="WhatsApp API Key"
            fullWidth
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSaveConfig}>
            Save Configuration
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PlatformConfig;
