
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminDashboard from './SuperAdminDashboard';
import MainLayout from './MainLayout';
import { AuthProvider } from './AuthProvider';
import { AppConfigProvider } from './AppConfigProvider';
import Team from './Team';
import Settings from './Settings';
import ConfigurationNeeded from './components/ConfigurationNeeded';
import Login from './Login';
import Unauthorized from './Unauthorized';

function App() {
  return (
    <AuthProvider>
      <AppConfigProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route 
              path="/" 
              element={<MainLayout />}
            >
              <Route index element={<Navigate to="/dashboard" />} />
              <Route 
                path="dashboard" 
                element={
                  <ConfigurationNeeded>
                    <Dashboard />
                  </ConfigurationNeeded>
                }
              />
              <Route 
                path="team" 
                element={<Team />}
              />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppConfigProvider>
    </AuthProvider>
  );
}

const Dashboard = () => {
  return <SuperAdminDashboard />;
};

export default App;
