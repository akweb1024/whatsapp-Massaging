
import { render, fireEvent, screen } from '@testing-library/react';
import CreateUserForm from './CreateUserForm';

describe('CreateUserForm', () => {
  it('renders all fields', () => {
    render(<CreateUserForm />);
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByText('Create User')).toBeInTheDocument();
  });

  it('shows an error when required fields are empty', async () => {
    render(<CreateUserForm />);
    fireEvent.click(screen.getByText('Create User'));
    expect(await screen.findByText('All fields are required')).toBeInTheDocument();
  });
});
