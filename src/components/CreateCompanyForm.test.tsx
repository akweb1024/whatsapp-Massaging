
import { render, fireEvent, screen } from '@testing-library/react';
import CreateCompanyForm from './CreateCompanyForm';

describe('CreateCompanyForm', () => {
  it('renders correctly', () => {
    render(<CreateCompanyForm />);
    expect(screen.getByLabelText('Company Name')).toBeInTheDocument();
    expect(screen.getByText('Create Company')).toBeInTheDocument();
  });

  it('shows an error when the company name is empty', async () => {
    render(<CreateCompanyForm />);
    fireEvent.click(screen.getByText('Create Company'));
    expect(await screen.findByText('Company name is required')).toBeInTheDocument();
  });
});
