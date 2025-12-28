
import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Company {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
}

interface CompanyFormModalProps {
  open: boolean;
  onClose: () => void;
  company: Company;
}

const CompanyFormModal = ({ open, onClose, company }: CompanyFormModalProps) => {
  const [name, setName] = useState(company.name);
  const [address, setAddress] = useState(company.address);
  const [city, setCity] = useState(company.city);
  const [country, setCountry] = useState(company.country);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(company.name);
    setAddress(company.address);
    setCity(company.city);
    setCountry(company.country);
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !address || !city || !country) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      const companyDocRef = doc(db, 'companies', company.id);
      await updateDoc(companyDocRef, { name, address, city, country });
      setSuccess('Company updated successfully!');
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
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
            disabled={loading}
          />
          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading}
          />
          <TextField
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading}
          />
          <TextField
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading}
          />
          <Box sx={{ position: 'relative' }}>
            <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
              Update Company
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CompanyFormModal;
