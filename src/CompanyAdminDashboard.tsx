import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Modal, TextField } from '@mui/material';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from './types';

const CompanyAdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);

  const fetchUsers = async () => {
    if (user && user.companyId) {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('companyId', '==', user.companyId));
      const userSnapshot = await getDocs(q);
      const userList = userSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
      setUsers(userList);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const handleOpen = (userToEdit: Partial<User> | null = null) => {
    if (userToEdit) {
      setCurrentUser(userToEdit);
      setIsEditing(true);
    } else {
      setCurrentUser({ email: '', role: 'agent', companyId: user?.companyId });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser(null);
  };

  const handleSave = async () => {
    if (currentUser && user && user.companyId) {
      if (isEditing && currentUser.id) {
        const userDoc = doc(db, 'users', currentUser.id);
        await updateDoc(userDoc, currentUser);
      } else {
        await addDoc(collection(db, 'users'), { ...currentUser, companyId: user.companyId });
      }
      fetchUsers();
      handleClose();
    }
  };

  const handleDelete = async (id: string) => {
    const userDoc = doc(db, 'users', id);
    await deleteDoc(userDoc);
    fetchUsers();
  };

  return (
    <Box>
      <Typography variant="h4">Company Admin Dashboard</Typography>
      <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Add User
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(u)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(u.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6">{isEditing ? 'Edit User' : 'Add User'}</Typography>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={currentUser?.email || ''}
            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
          />
          <TextField
            label="Role"
            fullWidth
            margin="normal"
            value={currentUser?.role || ''}
            onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value as 'agent' | 'company_admin' })}
          />
          <Button onClick={handleSave} variant="contained" sx={{ mt: 2 }}>Save</Button>
        </Box>
      </Modal>
    </Box>
  );
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default CompanyAdminDashboard;
