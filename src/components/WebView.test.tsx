import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WebView } from './WebView';

describe('WebView Component', () => {
  const testUrl = 'https://example.com';

  it('renders loading state initially', () => {
    render(<WebView initialUrl={testUrl} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays error state when loading fails', () => {
    render(<WebView initialUrl="invalid-url" />);
    expect(screen.getByText(/failed to load content/i)).toBeInTheDocument();
  });

  it('updates URL when submitted', () => {
    render(<WebView initialUrl={testUrl} showNavigation={true} />);
    const input = screen.getByPlaceholderText('Enter URL');
    const newUrl = 'https://new-url.com';
    fireEvent.change(input, { target: { value: newUrl } });
    fireEvent.submit(input);
    expect(input).toHaveValue(newUrl);
  });

  it('refreshes when refresh button clicked', () => {
    render(<WebView initialUrl={testUrl} showNavigation={true} />);
    const refreshButton = screen.getByTitle('Refresh');
    fireEvent.click(refreshButton);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
