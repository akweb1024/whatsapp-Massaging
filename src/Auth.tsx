import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserRole } from './types';
import { Link, useNavigate } from 'react-router-dom';

interface AuthProps {
  isSignUpFlow: boolean;
}

const Auth = ({ isSignUpFlow }: AuthProps) => {
  const [isSignUp, setIsSignUp] = useState(isSignUpFlow);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsSignUp(isSignUpFlow);
  }, [isSignUpFlow]);

  const handleAuthAction = async () => {
    setError(null);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: role,
        });
        console.log('User created successfully:', user);
        alert('Account created successfully! You will now be redirected to the homepage.');
        navigate('/');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully');
        navigate('/');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error);
        setError(error.message);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h5">{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Email Address"
        type="email"
        fullWidth
        required
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ maxWidth: 400 }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        required
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ maxWidth: 400 }}
      />
      {isSignUp && (
        <Select
          fullWidth
          value={role}
          onChange={(e: SelectChangeEvent<UserRole>) => setRole(e.target.value as UserRole)}
          displayEmpty
          sx={{ maxWidth: 400, mt: 1 }}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="superadmin">Super Admin</MenuItem>
        </Select>
      )}
      <Button onClick={handleAuthAction} variant="contained" sx={{ mt: 2 }}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Button>
      <Typography sx={{ mt: 1 }}>
        {isSignUp ? (
          <Link to="/login">Already have an account? Sign In</Link>
        ) : (
          <Link to="/signup">Don't have an account? Sign Up</Link>
        )}
      </Typography>
    </Box>
  );
};

export default Auth;
