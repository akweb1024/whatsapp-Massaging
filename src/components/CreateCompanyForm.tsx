
import { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CreateCompanyForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !address || !city || !country) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'companies'), { name, address, city, country });
      setSuccess('Company created successfully!');
      setName('');
      setAddress('');
      setCity('');
      setCountry('');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5">Create New Company</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success">{success}</Typography>}
      <TextField
        label="Company Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        disabled={loading}
      />
      <TextField
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        fullWidth
        margin="normal"
        disabled={loading}
      />
      <TextField
        label="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        fullWidth
        margin="normal"
        disabled={loading}
      />
      <TextField
        label="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        fullWidth
        margin="normal"
        disabled={loading}
      />
      <Box sx={{ position: 'relative' }}>
        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
          Create Company
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default CreateCompanyForm;
