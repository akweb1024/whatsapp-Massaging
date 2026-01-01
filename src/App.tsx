import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Auth from './Auth';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Companies from './pages/Companies';
import Messages from './pages/Messages';
import RoleBasedRoute from './components/RoleBasedRoute';
import theme from './theme';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { UserRole } from './types';
import { CircularProgress, Box } from '@mui/material';

function App() {
  const [user, initialising] = useAuthState(auth);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        } catch (error) {
          console.error("Failed to fetch user role:", error);
        }
      }
      setLoading(false);
    };
    fetchUserRole();
  }, [user]);

  if (initialising || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth isSignUpFlow={false} />} />
          <Route path="/signup" element={<Auth isSignUpFlow={true} />} />
          <Route path="/auth" element={<Navigate to="/login" />} />
          <Route 
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route 
            path="/users"
            element={
              <RoleBasedRoute allowedRoles={['superadmin']} currentUserRole={userRole}>
                <Users />
              </RoleBasedRoute>
            }
          />
          <Route 
            path="/settings"
            element={
              <RoleBasedRoute allowedRoles={['superadmin']} currentUserRole={userRole}>
                <Settings />
              </RoleBasedRoute>
            }
          />
           <Route 
            path="/companies"
            element={user ? <Companies /> : <Navigate to="/login" />}
          />
           <Route 
            path="/messages"
            element={user ? <Messages /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
