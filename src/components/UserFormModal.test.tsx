
import { render, fireEvent, screen } from '@testing-library/react';
import UserFormModal from './UserFormModal';
import { User } from '../types';

const mockUser: User = {
  uid: '123',
  email: 'test@example.com',
  fullName: 'Test User',
  role: 'agent',
  company: 'Test Company'
};

describe('UserFormModal', () => {
  it('renders with user data', () => {
    render(<UserFormModal open={true} onClose={() => {}} user={mockUser} />);
    expect(screen.getByLabelText('Full Name')).toHaveValue('Test User');
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
    expect(screen.getByLabelText('Role')).toHaveValue('agent');
    expect(screen.getByLabelText('Company')).toHaveValue('Test Company');
  });

  it('shows an error when full name is empty', async () => {
    render(<UserFormModal open={true} onClose={() => {}} user={mockUser} />);
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Update User'));
    expect(await screen.findByText('Full name and role are required')).toBeInTheDocument();
  });
});
