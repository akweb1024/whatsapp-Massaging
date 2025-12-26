import { List, ListItem, ListItemText } from '@mui/material';
import { useAuth } from './useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  const superAdminLinks = [
    { text: 'Dashboard', path: '/' },
    { text: 'Companies', path: '/companies' },
    { text: 'Financials', path: '/financials' },
    { text: 'Settings', path: '/settings' },
  ];

  const companyAdminLinks = [
    { text: 'Dashboard', path: '/' },
    { text: 'Inbox', path: '/inbox' },
    { text: 'Contacts', path: '/contacts' },
    { text: 'Campaigns', path: '/campaigns' },
    { text: 'Team', path: '/team' },
    { text: 'Billing', path: '/billing' },
    { text: 'API Settings', path: '/api-settings' },
  ];

  const agentLinks = [
    { text: 'Dashboard', path: '/' },
    { text: 'Inbox', path: '/inbox' },
    { text: 'My Contacts', path: '/my-contacts' },
    { text: 'My Reports', path: '/my-reports' },
  ];

  let links = [];
  if (user?.role === 'super_admin') {
    links = superAdminLinks;
  } else if (user?.role === 'company_admin') {
    links = companyAdminLinks;
  } else {
    links = agentLinks;
  }

  return (
    <List>
      {links.map((link) => (
        <ListItem button key={link.text} component="a" href={link.path}>
          <ListItemText primary={link.text} />
        </ListItem>
      ))}
    </List>
  );
};

export default Sidebar;
