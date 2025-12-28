
import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button
} from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Company {
    id: string;
    name: string;
}

interface CompanyFormModalProps {
  open: boolean;
  onClose: () => void;
  company: Company;
}

const CompanyFormModal = ({ open, onClose, company }: CompanyFormModalProps) => {
  const [name, setName] = useState(company.name);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setName(company.name);
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name) {
      setError('Company name is required');
      return;
    }

    try {
      const companyDocRef = doc(db, 'companies', company.id);
      await updateDoc(companyDocRef, { name });
      setSuccess('Company updated successfully!');
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2">
          Edit Company
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
            Update Company
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CompanyFormModal;
