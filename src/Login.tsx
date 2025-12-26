
import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Grid,
  Link
} from '@mui/material';
import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const createSuperAdmin = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, 'puneet@skillzip.com', 'Admin@123');
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: 'puneet@skillzip.com',
        role: 'super_admin',
        companyId: 'skillzip'
      });
      alert('Super admin created successfully!');
    } catch (error) {
      console.error('Error creating super admin:', error);
      alert('Failed to create super admin.');
    }
  };

  const handleAuth = async () => {
    setError('');
    setInfo('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handlePasswordReset = async () => {
    setError('');
    setInfo('');
    if (!email) {
        setError("Please enter your email to reset your password.");
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        setInfo("Password reset email sent. Please check your inbox.");
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '15px' }}>
        <Typography component="h1" variant="h4" sx={{fontWeight: 'bold', mb: 3}}>
          {isSignUp ? 'Create an Account' : 'Welcome Back'}
        </Typography>
        <Box component="form" sx={{ mt: 1 }} onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          {info && <Typography color="primary" sx={{ mt: 2 }}>{info}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, borderRadius: '25px', py: 1.5, textTransform: 'none', fontSize: '1rem' }}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <Grid container>
            <Grid item xs>
                <Link href="#" variant="body2" onClick={handlePasswordReset}>
                    Forgot password?
                </Link>
            </Grid>
            <Grid item>
                <Link href="#" variant="body2" onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </Link>
            </Grid>
          </Grid>
        </Box>
        <Button onClick={createSuperAdmin} sx={{mt: 2}}>Create Super Admin (for testing)</Button>
      </Paper>
    </Container>
  );
};

export default Login;
