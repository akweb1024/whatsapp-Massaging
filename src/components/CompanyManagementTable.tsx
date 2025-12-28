
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import CompanyFormModal from './CompanyFormModal';

interface Company {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
}

const CompanyManagementTable = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'companies'), (querySnapshot) => {
      const companiesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Company[];
      setCompanies(companiesData);
      setLoading(false);
    }, (err) => {
      setError('Failed to fetch companies.');
      console.error('Error fetching companies:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteCompany = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await deleteDoc(doc(db, 'companies', id));
      } catch (error) {
        setError('Failed to delete company.');
        console.error('Error deleting company:', error);
      }
    }
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingCompany(null);
    setIsModalOpen(false);
  };
  
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ mt: 3 }}>
        <Typography variant="h5">Company Management</Typography>
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {companies.map((company) => (
                <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.address}</TableCell>
                <TableCell>{company.city}</TableCell>
                <TableCell>{company.country}</TableCell>
                <TableCell>
                    <IconButton onClick={() => handleEditCompany(company)}>
                    <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteCompany(company.id)}>
                    <Delete />
                    </IconButton>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
        {isModalOpen && editingCompany && (
            <CompanyFormModal
                open={isModalOpen}
                onClose={handleCloseModal}
                company={editingCompany}
            />
        )}
    </Box>
  );
};

export default CompanyManagementTable;
