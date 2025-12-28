import { useState } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
} from '@mui/material';
import { CompaniesTable } from '../components/CompaniesTable';
import { CompanyForm } from '../components/CompanyForm';
import { Company } from '../types';

const Companies = () => {
  const [open, setOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);

  const handleOpen = (company: Company | null = null) => {
    setCurrentCompany(company);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCompany(null);
  };

  const handleSave = async (company: Omit<Company, 'id'>) => {
    if (currentCompany) {
      await updateDoc(doc(db, 'companies', currentCompany.id), company);
    } else {
      await addDoc(collection(db, 'companies'), company);
    }
    handleClose();
  };

  return (
    <div>
      <Button onClick={() => handleOpen()}>Add Company</Button>
      <CompaniesTable onEdit={handleOpen} />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentCompany ? 'Edit Company' : 'Add Company'}</DialogTitle>
        <DialogContent>
          <CompanyForm company={currentCompany} onSave={handleSave} onCancel={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Companies;
