import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CreateUserForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('agent');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || !fullName || !role) {
      setError('All fields are required');
      return;
    }

    try {
      // This is a simplified example. In a real app, you would use Firebase Authentication to create a user
      // and then add the user's details to Firestore.
      await addDoc(collection(db, 'users'), {
        email,
        fullName,
        role,
        company: role === 'company_admin' || role === 'agent' ? company : '',
      });
      setSuccess('User created successfully!');
      // Clear form
      setEmail('');
      setPassword('');
      setFullName('');
      setRole('agent');
      setCompany('');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6">Create New User</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success">{success}</Typography>}
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        fullWidth
        margin="normal"
      />
        <TextField
            label="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            fullWidth
            margin="normal"
        />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Create User
      </Button>
    </Box>
  );
};

export default CreateUserForm;
