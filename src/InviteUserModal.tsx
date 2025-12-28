import { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Select, MenuItem } from '@mui/material';
import { UserRole } from './types';

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (email: string, role: UserRole) => void;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const InviteUserModal = ({ open, onClose, onInvite }: InviteUserModalProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('agent');

  const handleInvite = () => {
    onInvite(email, role);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6">Invite User</Typography>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Select fullWidth value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
          <MenuItem value="agent">Agent</MenuItem>
          <MenuItem value="company_admin">Company Admin</MenuItem>
        </Select>
        <Button onClick={handleInvite} variant="contained" sx={{ mt: 2 }}>Invite</Button>
      </Box>
    </Modal>
  );
};

export default InviteUserModal;
