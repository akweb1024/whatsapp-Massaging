
import { useState } from 'react';
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const CreateUserForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !email || !password || !role) {
      setError('All fields are required');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        fullName,
        email,
        role,
        company: role === 'company_admin' || role === 'agent' ? company : '',
      });

      setSuccess('User created successfully!');
      setFullName('');
      setEmail('');
      setPassword('');
      setRole('');
      setCompany('');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5">Create New User</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success">{success}</Typography>}
      <TextField
        label="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        fullWidth
        margin="normal"
      />
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
      <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          label="Role"
        >
          <MenuItem value="super_admin">Super Admin</MenuItem>
          <MenuItem value="company_admin">Company Admin</MenuItem>
          <MenuItem value="agent">Agent</MenuItem>
        </Select>
      </FormControl>
      {(role === 'company_admin' || role === 'agent') && (
        <TextField
          label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          fullWidth
          margin="normal"
        />
      )}
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Create User
      </Button>
    </Box>
  );
};

export default CreateUserForm;
