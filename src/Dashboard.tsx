
import { useAuth } from './contexts/AuthContext';
import SuperAdminDashboard from './SuperAdminDashboard';
import CompanyAdminDashboard from './CompanyAdminDashboard';
import AgentDashboard from './AgentDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'company_admin':
      return <CompanyAdminDashboard />;
    case 'agent':
      return <AgentDashboard />;
    default:
      return null;
  }
};

export default Dashboard;
