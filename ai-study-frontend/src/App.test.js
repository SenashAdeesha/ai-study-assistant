import { render, screen } from '@testing-library/react';
import App from './App';

test('renders study assistant heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', {
    name: /study smarter with a clean, modern assistant/i,
  });
  expect(headingElement).toBeInTheDocument();
});
