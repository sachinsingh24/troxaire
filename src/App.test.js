import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders the Troxaire landing page and contact form', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Kenya's first dedicated HVAC airside products manufacturer/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Get in touch/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /download company profile/i })).toBeInTheDocument();
});

test('validates the form and filters countries from the keyboard search', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
  expect(screen.getByText('Please enter a valid phone number.')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Select country and dialing code' }));
  const countryMenu = screen.getByRole('listbox');
  ['I', 'n', 'd', 'i', 'a'].forEach((key) => fireEvent.keyDown(countryMenu, { key }));
  expect(screen.getByRole('option', { name: /India.*\+91/i })).toBeInTheDocument();
});
