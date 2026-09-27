import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';

describe('UI Design System Component Tests', () => {
  it('renders Button with variants and children correctly', () => {
    render(<Button variant="primary">Submit Application</Button>);
    const btn = screen.getByRole('button', { name: /submit application/i });
    expect(btn).toBeInTheDocument();
  });

  it('renders Badge with custom label and dot indicator', () => {
    render(<Badge variant="gold" dot>AP Scholar</Badge>);
    expect(screen.getByText(/ap scholar/i)).toBeInTheDocument();
  });

  it('renders Alert component with semantic feedback', () => {
    render(<Alert type="success" title="Success!">Application processed.</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/application processed/i)).toBeInTheDocument();
  });
});
