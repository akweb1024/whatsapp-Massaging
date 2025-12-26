import { useState } from 'react';
import { IconButton, CircularProgress } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface UploadButtonProps {
  onUploadComplete: (url: string) => void;
}

const UploadButton = ({ onUploadComplete }: UploadButtonProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      const storageRef = ref(storage, `media/${Date.now()}_${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        onUploadComplete(downloadURL);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <IconButton component="label" disabled={uploading} sx={{color: '#AEB4B7'}}>
      {uploading ? <CircularProgress size={24} /> : <AttachFileIcon />}
      <input type="file" hidden onChange={handleFileChange} accept="image/*,video/*" />
    </IconButton>
  );
};

export default UploadButton;
