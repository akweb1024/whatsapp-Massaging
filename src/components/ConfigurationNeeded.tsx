
import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import PlatformConfig from './PlatformConfig';
import { useAuth } from '../hooks/useAuth';
import { Box, Typography } from '@mui/material';

const ConfigurationNeeded = ({ children }) => {
  const { user } = useAuth();
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'platform', 'config');

    const unsub = onSnapshot(docRef, (doc) => {
      if (doc.exists() && doc.data().apiKey && doc.data().apiUrl) {
        setIsConfigured(true);
      } else {
        setIsConfigured(false);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!isConfigured) {
    if (user?.role === 'super_admin') {
      return (
        <Box>
          <Typography variant="h5" color="error" gutterBottom>
            Platform configuration needed.
          </Typography>
          <Typography gutterBottom>
            Please enter the WhatsApp API credentials to enable messaging features.
          </Typography>
          <PlatformConfig />
        </Box>
      );
    }
    return <Typography>The platform is not yet configured for messaging. Please contact the administrator.</Typography>;
  }

  return children;
};

export default ConfigurationNeeded;
