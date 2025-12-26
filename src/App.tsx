import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CssBaseline, createTheme, ThemeProvider, CircularProgress } from "@mui/material";
import { AuthProvider, useAuth } from "./useAuth";
import { AppConfigProvider, useAppConfig } from "./AppConfigContext";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar";
import ConfigurationNeeded from "./components/ConfigurationNeeded";
import PlatformConfig from "./components/PlatformConfig";

const theme = createTheme({
  palette: {
    primary: {
      main: "#075e54",
    },
    secondary: {
      main: "#25d366",
    },
  },
});

const AppContent = () => {
  const { user, loading: authLoading } = useAuth();
  const { apiCredentials, loading: configLoading } = useAppConfig();

  if (authLoading || configLoading) {
    return <CircularProgress />;
  }

  // Super admin sees platform config if keys are missing
  if (user?.role === 'super_admin' && !apiCredentials) {
    return <PlatformConfig />;
  }

  // Other users see a waiting screen if keys are missing
  if (user?.role !== 'super_admin' && !apiCredentials) {
    return <ConfigurationNeeded />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/platform-config" element={<ProtectedRoute requiredRole="super_admin"><PlatformConfig /></ProtectedRoute>} />
        </Routes>
      </Box>
    </Box>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppConfigProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<AppContent />} />
            </Routes>
          </AppConfigProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
