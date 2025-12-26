import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from './firebase';
import { useTenant } from './TenantProvider';
import { User, UserRole } from './types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InviteUserModal from './InviteUserModal';

const Team = () => {
  const { companyId } = useTenant();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('companyId', '==', companyId));
    const querySnapshot = await getDocs(q);
    const userList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as User[];
    setUsers(userList);
    setLoading(false);
  }, [companyId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInviteUser = async (email: string, name: string, role: UserRole) => {
    if (!companyId) return;
    const functions = getFunctions();
    const inviteUser = httpsCallable(functions, 'inviteUser');
    try {
      await inviteUser({ email, name, role, companyId });
      setInviteModalOpen(false);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error inviting user:", error);
      // Handle error display to the user
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Team Management</Typography>
        <Button variant="contained" color="primary" onClick={() => setInviteModalOpen(true)}>Invite User</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Loading...</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.displayName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton aria-label="edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <InviteUserModal
        open={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvite={handleInviteUser}
      />
    </Box>
  );
};

export default Team;
