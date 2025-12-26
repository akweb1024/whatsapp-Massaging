import { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './useAuth';
import { useTenant } from './TenantProvider';

const ApiSettings = () => {
  const { user } = useAuth();
  const { companyId } = useTenant();
  const [accessToken, setAccessToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [webAppKey, setWebAppKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      setError('No company associated with this user.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const companyRef = doc(db, 'companies', companyId);
      await updateDoc(companyRef, {
        'apiCredentials.accessToken': accessToken,
        'apiCredentials.phoneNumberId': phoneNumberId,
        'apiCredentials.webAppKey': webAppKey,
      });
      // Optionally, show a success message
    } catch (err) {
      setError('Failed to update API credentials.');
    }
    setLoading(false);
  };

  if (user?.role !== 'company_admin') {
    return <Typography>You do not have permission to view this page.</Typography>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" sx={{ mb: 3 }}>API Settings</Typography>
      <TextField
        label="WhatsApp Access Token"
        fullWidth
        margin="normal"
        type="password"
        value={accessToken}
        onChange={(e) => setAccessToken(e.target.value)}
        required
      />
      <TextField
        label="Phone Number ID"
        fullWidth
        margin="normal"
        value={phoneNumberId}
        onChange={(e) => setPhoneNumberId(e.target.value)}
        required
      />
      <TextField
        label="Web App Key"
        fullWidth
        margin="normal"
        type="password"
        value={webAppKey}
        onChange={(e) => setWebAppKey(e.target.value)}
        required
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }}>
        {loading ? <CircularProgress size={24} /> : 'Save Credentials'}
      </Button>
    </Box>
  );
};

export default ApiSettings;
