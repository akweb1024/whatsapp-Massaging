
import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  setDoc, 
  doc 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth as firebaseAuth } from './firebase';
import { useAuth } from './hooks/useAuth';
import { Company, User } from './types';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Select, 
  MenuItem 
} from '@mui/material';
import PlatformConfig from './components/PlatformConfig';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('agent');
  const [newUserCompany, setNewUserCompany] = useState('');

  useEffect(() => {
    if (user?.role === 'super_admin') {
      fetchCompanies();
      fetchUsers();
    }
  }, [user]);

  const fetchCompanies = async () => {
    const companiesCollection = collection(db, 'companies');
    const companiesSnapshot = await getDocs(companiesCollection);
    setCompanies(companiesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Company)));
  };

  const fetchUsers = async () => {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    setUsers(usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User)));
  };

  const handleAddCompany = async () => {
    if (newCompanyName.trim() !== '') {
      await addDoc(collection(db, 'companies'), { name: newCompanyName });
      setNewCompanyName('');
      fetchCompanies();
    }
  };

  const handleAddUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, newUserEmail, newUserPassword);
      const newUser = {
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        companyId: newUserCompany,
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      // Reset form
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('agent');
      setNewUserCompany('');
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  if (user?.role !== 'super_admin') {
    return <Typography>You do not have permission to view this page.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Super Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PlatformConfig />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Manage Companies</Typography>
            <TextField
              label="New Company Name"
              fullWidth
              margin="normal"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddCompany}>Add Company</Button>
            <List sx={{ mt: 2 }}>
              {companies.map(company => (
                <ListItem key={company.id}>
                  <ListItemText primary={company.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Manage Users</Typography>
            <TextField label="Name" fullWidth margin="normal" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
            <TextField label="Email" fullWidth margin="normal" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
            <TextField label="Password" type="password" fullWidth margin="normal" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} />
            <Select fullWidth value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
              <MenuItem value="agent">Agent</MenuItem>
              <MenuItem value="company_admin">Company Admin</MenuItem>
              <MenuItem value="super_admin">Super Admin</MenuItem>
            </Select>
            <Select fullWidth value={newUserCompany} onChange={(e) => setNewUserCompany(e.target.value)} displayEmpty>
              <MenuItem value="" disabled>Select Company</MenuItem>
              {companies.map(company => (
                <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
              ))}
            </Select>
            <Button variant="contained" onClick={handleAddUser} sx={{ mt: 2 }}>Add User</Button>
            <List sx={{ mt: 2 }}>
              {users.map(u => (
                <ListItem key={u.id}>
                  <ListItemText primary={`${u.name} (${u.email})`} secondary={u.role} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SuperAdminDashboard;
