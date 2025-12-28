
import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CreateCompanyForm = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name) {
      setError('Company name is required');
      return;
    }

    try {
      await addDoc(collection(db, 'companies'), { name });
      setSuccess('Company created successfully!');
      setName('');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
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
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Create Company
      </Button>
    </Box>
  );
};

export default CreateCompanyForm;
