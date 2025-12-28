import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { User, UserRole } from '../types';
import CreateUserForm from './CreateUserForm';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const UserFormModal = ({ open, onClose, user }: UserFormModalProps) => {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('agent');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setRole(user.role);
      setCompany(user.company || '');
    } else {
      setFullName('');
      setRole('agent');
      setCompany('');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !role) {
      setError('Full name and role are required');
      return;
    }

    try {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          fullName,
          role,
          company: role === 'company_admin' || role === 'agent' ? company : '',
          updatedAt: serverTimestamp(),
        });
        setSuccess('User updated successfully!');
      } else {
        // Logic for creating a new user is handled in CreateUserForm
      }
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        {user ? (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="h6" component="h2">
              Edit User
            </Typography>
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
              value={user.email}
              disabled
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
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
              Update User
            </Button>
          </Box>
        ) : (
          <CreateUserForm />
        )}
      </Box>
    </Modal>
  );
};

export default UserFormModal;
