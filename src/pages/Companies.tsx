import { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import { 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField 
} from '@mui/material';

interface CompanyData {
  id: string;
  name: string;
  address: string;
}

const Companies = () => {
  const [companies, loading] = useCollectionData(collection(db, 'companies'));
  const [open, setOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<CompanyData | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleOpen = (company: CompanyData | null = null) => {
    setCurrentCompany(company);
    setName(company ? company.name : '');
    setAddress(company ? company.address : '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (currentCompany) {
      await updateDoc(doc(db, 'companies', currentCompany.id), { name, address });
    } else {
      await addDoc(collection(db, 'companies'), { name, address });
    }
    handleClose();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'companies', id));
  };

  return (
    <Paper>
      <Button onClick={() => handleOpen()}>Add Company</Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow>}
            {companies && (companies as CompanyData[]).map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.address}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(company)}>Edit</Button>
                  <Button onClick={() => handleDelete(company.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentCompany ? 'Edit Company' : 'Add Company'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Companies;
