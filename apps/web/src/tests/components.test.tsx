import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Avatar,
  Modal,
  Drawer,
  Dropdown,
  Alert,
  Badge,
  Pagination,
  Tabs,
  Accordion,
  ConfirmationDialog,
  EmptyState,
  ErrorState,
  Spinner,
  Skeleton,
} from '../components/ui';

describe('UI Component System — Comprehensive Component Tests', () => {
  // 1. Button Tests
  describe('Button Component', () => {
    it('renders with children and handles click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders loading state and disables user interactions', () => {
      const handleClick = vi.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Submitting
        </Button>
      );
      const button = screen.getByRole('button', { name: /submitting/i });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies variant classes correctly', () => {
      const { rerender } = render(<Button variant="danger">Delete</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-danger-600');

      rerender(<Button variant="gold">Enroll</Button>);
      expect(screen.getByRole('button')).toHaveClass('from-gold-500');
    });
  });

  // 2. Input Tests
  describe('Input Component', () => {
    it('renders label, input, and updates value', () => {
      const handleChange = vi.fn();
      render(
        <Input
          label="Student Name"
          placeholder="Enter name"
          onChange={handleChange}
        />
      );
      expect(screen.getByLabelText(/student name/i)).toBeInTheDocument();
      const input = screen.getByPlaceholderText(/enter name/i);
      fireEvent.change(input, { target: { value: 'Liam Vance' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('renders error state with aria-invalid and error alert message', () => {
      render(
        <Input
          label="Email"
          error="Valid email is required"
        />
      );
      const input = screen.getByLabelText(/email/i);
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByRole('alert')).toHaveTextContent('Valid email is required');
    });

    it('renders helper text when provided', () => {
      render(
        <Input
          label="ID Number"
          helperText="Include 3-digit prefix"
        />
      );
      expect(screen.getByText('Include 3-digit prefix')).toBeInTheDocument();
    });
  });

  // 3. Textarea Tests
  describe('Textarea Component', () => {
    it('renders textarea with custom rows and handles input', () => {
      const handleChange = vi.fn();
      render(
        <Textarea
          label="Remarks"
          rows={5}
          onChange={handleChange}
        />
      );
      const textarea = screen.getByLabelText(/remarks/i);
      expect(textarea).toHaveAttribute('rows', '5');
      fireEvent.change(textarea, { target: { value: 'Excellent progress' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('displays error and aria-invalid on validation failure', () => {
      render(<Textarea label="Notes" error="Remarks too short" />);
      const textarea = screen.getByLabelText(/notes/i);
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByRole('alert')).toHaveTextContent('Remarks too short');
    });
  });

  // 4. Select Tests
  describe('Select Component', () => {
    const options = [
      { label: 'Grade 9', value: '9' },
      { label: 'Grade 10', value: '10' },
      { label: 'Grade 11', value: '11' },
    ];

    it('renders options and responds to selection changes', () => {
      const handleChange = vi.fn();
      render(
        <Select
          label="Grade Level"
          options={options}
          onChange={handleChange}
        />
      );
      const select = screen.getByLabelText(/grade level/i);
      fireEvent.change(select, { target: { value: '10' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('renders error message and aria-invalid attribute', () => {
      render(
        <Select
          label="Grade Level"
          options={options}
          error="Grade level is required"
        />
      );
      expect(screen.getByLabelText(/grade level/i)).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByRole('alert')).toHaveTextContent('Grade level is required');
    });
  });

  // 5. Checkbox Tests
  describe('Checkbox Component', () => {
    it('renders with label and toggles checked state', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          label="Agree to Academy Guidelines"
          checked={false}
          onChange={handleChange}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalled();
    });

    it('respects disabled state', () => {
      render(
        <Checkbox
          label="Locked Consent"
          disabled
        />
      );
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });
  });

  // 6. RadioGroup Tests
  describe('RadioGroup Component', () => {
    const radioOptions = [
      { label: 'Morning Session', value: 'morning' },
      { label: 'Afternoon Session', value: 'afternoon' },
    ];

    it('renders radiogroup and triggers onChange upon item selection', () => {
      const handleChange = vi.fn();
      render(
        <RadioGroup
          name="session"
          label="Class Session"
          options={radioOptions}
          selectedValue="morning"
          onChange={handleChange}
        />
      );
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
      const radios = screen.getAllByRole('radio');
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();

      fireEvent.click(radios[1]);
      expect(handleChange).toHaveBeenCalledWith('afternoon');
    });
  });

  // 7. Switch Component
  describe('Switch Component', () => {
    it('renders with switch role and responds to toggle', () => {
      const handleChange = vi.fn();
      render(
        <Switch
          label="Email Notifications"
          checked={true}
          onChange={handleChange}
        />
      );
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
      fireEvent.click(switchEl);
      expect(handleChange).toHaveBeenCalledWith(false);
    });
  });

  // 8. Avatar Tests
  describe('Avatar Component', () => {
    it('renders initials from user name', () => {
      render(<Avatar name="Liam Vance" size="md" />);
      expect(screen.getByText('LV')).toBeInTheDocument();
    });

    it('renders status indicator badge when provided', () => {
      render(<Avatar name="Emma Watson" status="online" />);
      expect(screen.getByTitle('Status: online')).toBeInTheDocument();
    });

    it('renders custom fallback icon or content', () => {
      render(<Avatar fallback={<span data-testid="custom-fallback">Icon</span>} />);
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    });
  });

  // 9. Modal Tests
  describe('Modal Component', () => {
    it('renders when isOpen is true and invokes onClose on button click', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Enrollment Dialog">
          <p>Dialog body text</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Enrollment Dialog')).toBeInTheDocument();
      expect(screen.getByText('Dialog body text')).toBeInTheDocument();

      const closeBtn = screen.getByLabelText(/close dialog/i);
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={vi.fn()} title="Hidden Modal">
          <p>Invisible</p>
        </Modal>
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  // 10. Drawer Tests
  describe('Drawer Component', () => {
    it('renders when isOpen is true and closes via close button', () => {
      const handleClose = vi.fn();
      render(
        <Drawer isOpen={true} onClose={handleClose} title="Student Dossier">
          <p>Dossier Content</p>
        </Drawer>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Student Dossier')).toBeInTheDocument();

      const closeBtn = screen.getByLabelText(/close drawer/i);
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  // 11. Dropdown Tests
  describe('Dropdown Component', () => {
    it('opens menu on trigger click and executes item action', () => {
      const handleAction = vi.fn();
      render(
        <Dropdown
          trigger={<button>Options Menu</button>}
          items={[
            { label: 'Download PDF', onClick: handleAction },
            { label: 'Print Record' },
          ]}
        />
      );

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      const trigger = screen.getByText('Options Menu');
      fireEvent.click(trigger);

      expect(screen.getByRole('menu')).toBeInTheDocument();
      const item = screen.getByText('Download PDF');
      fireEvent.click(item);
      expect(handleAction).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  // 12. Alert Tests
  describe('Alert Component', () => {
    it('renders semantic alert with title and content', () => {
      render(
        <Alert type="warning" title="Important Notice">
          Tuition deadline approaching
        </Alert>
      );
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(screen.getByText('Important Notice')).toBeInTheDocument();
      expect(screen.getByText('Tuition deadline approaching')).toBeInTheDocument();
    });

    it('triggers dismiss callback when dismiss button is clicked', () => {
      const handleDismiss = vi.fn();
      render(
        <Alert type="info" onDismiss={handleDismiss}>
          Dismissable info
        </Alert>
      );
      const dismissBtn = screen.getByLabelText(/dismiss alert/i);
      fireEvent.click(dismissBtn);
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
  });

  // 13. Badge Tests
  describe('Badge Component', () => {
    it('renders with variants and dot indicator', () => {
      render(
        <Badge variant="success" dot>
          Active Scholar
        </Badge>
      );
      expect(screen.getByText('Active Scholar')).toBeInTheDocument();
    });
  });

  // 14. Pagination Tests
  describe('Pagination Component', () => {
    it('renders pages and dispatches page selection', () => {
      const handlePageChange = vi.fn();
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalRecords={50}
          pageSize={10}
          onPageChange={handlePageChange}
        />
      );
      expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
      const page3Btn = screen.getByLabelText('Page 3');
      fireEvent.click(page3Btn);
      expect(handlePageChange).toHaveBeenCalledWith(3);
    });

    it('disables previous button on first page', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={vi.fn()}
        />
      );
      expect(screen.getByLabelText('Previous page')).toBeDisabled();
    });
  });

  // 15. Tabs Tests
  describe('Tabs Component', () => {
    it('renders tabs and handles tab change', () => {
      const handleChange = vi.fn();
      const tabs = [
        { id: 'general', label: 'General Info' },
        { id: 'curriculum', label: 'Curriculum' },
      ];
      render(
        <Tabs tabs={tabs} activeTab="general" onChange={handleChange} />
      );
      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();

      const secondTab = screen.getByRole('tab', { name: /curriculum/i });
      fireEvent.click(secondTab);
      expect(handleChange).toHaveBeenCalledWith('curriculum');
    });
  });

  // 16. Accordion Tests
  describe('Accordion Component', () => {
    it('toggles accordion content on header click', () => {
      const items = [
        { id: '1', title: 'Campus Tour Schedule', content: 'Tours run daily at 10 AM' },
        { id: '2', title: 'Uniform Policy', content: 'Blazers required on Mondays' },
      ];
      render(<Accordion items={items} />);
      expect(screen.queryByText('Tours run daily at 10 AM')).not.toBeInTheDocument();

      const button = screen.getByText('Campus Tour Schedule');
      fireEvent.click(button);
      expect(screen.getByText('Tours run daily at 10 AM')).toBeInTheDocument();

      // Click again to close
      fireEvent.click(button);
      expect(screen.queryByText('Tours run daily at 10 AM')).not.toBeInTheDocument();
    });
  });

  // 17. ConfirmationDialog Tests
  describe('ConfirmationDialog Component', () => {
    it('triggers onConfirm and onClose actions', () => {
      const handleConfirm = vi.fn();
      const handleClose = vi.fn();
      render(
        <ConfirmationDialog
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title="Delete Assessment?"
          message="This action is irreversible."
          confirmLabel="Delete"
        />
      );
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(screen.getByText('Delete Assessment?')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      expect(handleConfirm).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  // 18. EmptyState & ErrorState Tests
  describe('Feedback States', () => {
    it('renders EmptyState with action', () => {
      render(
        <EmptyState
          title="No Notices Available"
          description="Check back tomorrow for morning announcements."
          action={<button>Refresh</button>}
        />
      );
      expect(screen.getByText('No Notices Available')).toBeInTheDocument();
      expect(screen.getByText(/morning announcements/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    });

    it('renders ErrorState with retry trigger', () => {
      const handleRetry = vi.fn();
      render(
        <ErrorState
          title="Network Timeout"
          description="Unable to connect to school server."
          onRetry={handleRetry}
        />
      );
      expect(screen.getByText('Network Timeout')).toBeInTheDocument();
      const retryBtn = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  // 19. Spinner & Skeleton Tests
  describe('Loading Indicators', () => {
    it('renders accessible Spinner with status role and sr-only label', () => {
      render(<Spinner label="Loading gradebook records..." />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading gradebook records...')).toBeInTheDocument();
    });

    it('renders Skeleton with proper classes', () => {
      const { container } = render(<Skeleton variant="rectangular" width={200} height={100} />);
      expect(container.firstChild).toHaveClass('shimmer-bg', 'rounded-xl');
    });
  });
});
