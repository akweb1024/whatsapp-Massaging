import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  TextField,
} from '@mui/material';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Company } from './types';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Partial<Company> | null>(null);

  const fetchCompanies = async () => {
    const companiesCollection = collection(db, 'companies');
    const companySnapshot = await getDocs(companiesCollection);
    const companyList = companySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Company));
    setCompanies(companyList);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleOpen = (company: Partial<Company> | null = null) => {
    if (company) {
      setCurrentCompany(company);
      setIsEditing(true);
    } else {
      setCurrentCompany({ name: '', maxUsers: 0, maxConversations: 0 });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCompany(null);
  };

  const handleSave = async () => {
    if (currentCompany) {
      if (isEditing && currentCompany.id) {
        const companyDoc = doc(db, 'companies', currentCompany.id);
        await updateDoc(companyDoc, currentCompany);
      } else {
        await addDoc(collection(db, 'companies'), currentCompany);
      }
      fetchCompanies();
      handleClose();
    }
  };

  const handleDelete = async (id: string) => {
    const companyDoc = doc(db, 'companies', id);
    await deleteDoc(companyDoc);
    fetchCompanies();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Super Admin Dashboard</Typography>
        <Button variant="contained" onClick={() => navigate('/platform-config')}>
          Platform Configuration
        </Button>
      </Box>
      
      <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Add Company
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Max Users</TableCell>
              <TableCell>Max Conversations</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.maxUsers}</TableCell>
                <TableCell>{company.maxConversations}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(company)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(company.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6">{isEditing ? 'Edit Company' : 'Add Company'}</Typography>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={currentCompany?.name || ''}
            onChange={(e) => setCurrentCompany({ ...currentCompany, name: e.target.value })}
          />
          <TextField
            label="Max Users"
            type="number"
            fullWidth
            margin="normal"
            value={currentCompany?.maxUsers || 0}
            onChange={(e) => setCurrentCompany({ ...currentCompany, maxUsers: Number(e.target.value) })}
          />
          <TextField
            label="Max Conversations"
            type="number"
            fullWidth
            margin="normal"
            value={currentCompany?.maxConversations || 0}
            onChange={(e) => setCurrentCompany({ ...currentCompany, maxConversations: Number(e.target.value) })}
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

export default SuperAdminDashboard;
