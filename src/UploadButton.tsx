import { IconButton } from '@mui/material';
import { AttachFile } from '@mui/icons-material';

const UploadButton = ({ onUpload }: { onUpload: (file: File) => void }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onUpload(event.target.files[0]);
    }
  };

  return (
    <IconButton component="label">
      <AttachFile />
      <input type="file" hidden onChange={handleFileChange} />
    </IconButton>
  );
};

export default UploadButton;
