import { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { Company } from '../types';

interface CompanyFormProps {
  company: Company | null;
  onSave: (company: Omit<Company, 'id'>) => void;
  onCancel: () => void;
}

export const CompanyForm = ({ company, onSave, onCancel }: CompanyFormProps) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (company) {
      setName(company.name);
      setAddress(company.address || '');
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving company:', { name, address });
    onSave({ name, address });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained">Save</Button>
      <Button onClick={onCancel} style={{ marginLeft: '1rem' }}>Cancel</Button>
    </form>
  );
};
