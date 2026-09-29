import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NoticesSection } from '../pages/portal/admin/sections/NoticesSection';
import { EventsSection } from '../pages/portal/admin/sections/EventsSection';
import { EventsPage } from '../pages/public/EventsPage';
import { ToastProvider } from '../components/ui/Toast';

// Mock api service
vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  setAccessToken: vi.fn(),
  getAccessToken: vi.fn().mockReturnValue('mock-token'),
}));

import { api } from '../services/api';

describe('PHASE 15 — Notice and Event Management Frontend Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // 1. NOTICE MANAGEMENT (CRUD, LIFECYCLE, SEARCH, FILTER, PAGINATION)
  // =========================================================================
  describe('Admin Notices Management Section', () => {
    const mockNotices = [
      {
        id: 'not-101',
        title: 'Fall Semester Final Exam Schedule',
        description: 'Comprehensive guidelines and timetable for final evaluations.',
        content: 'Comprehensive guidelines and timetable for final evaluations.',
        category: 'EXAMINATION',
        publishDate: '2026-10-01T09:00:00Z',
        expiryDate: '2026-11-01T18:00:00Z',
        attachment: 'https://oakridge.edu/docs/exam_schedule.pdf',
        status: 'PUBLISHED',
        isPinned: true,
        authorName: 'Examination Office',
      },
      {
        id: 'not-102',
        title: 'Draft Security Contingency Plan',
        description: 'Internal draft protocol for inclement weather procedures.',
        content: 'Internal draft protocol for inclement weather procedures.',
        category: 'ADMINISTRATIVE',
        publishDate: '2026-10-05T09:00:00Z',
        status: 'DRAFT',
        isPinned: false,
        authorName: 'Head of Operations',
      },
      {
        id: 'not-103',
        title: 'Spring Gala 2025 Retrospective',
        description: 'Archived bulletin celebrating donor contributions from 2025.',
        content: 'Archived bulletin celebrating donor contributions from 2025.',
        category: 'GENERAL',
        publishDate: '2025-05-10T09:00:00Z',
        status: 'ARCHIVED',
        isPinned: false,
        authorName: 'Development Office',
      },
    ];

    it('should render notice management controls and list notices with status badges', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { success: true, data: mockNotices },
      });

      render(
        <ToastProvider>
          <BrowserRouter>
            <NoticesSection />
          </BrowserRouter>
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Fall Semester Final Exam Schedule')).toBeInTheDocument();
      });

      expect(screen.getByText('Draft Security Contingency Plan')).toBeInTheDocument();
      expect(screen.getByText('Spring Gala 2025 Retrospective')).toBeInTheDocument();

      // Check status badges
      expect(screen.getByText('Published')).toBeInTheDocument();
      expect(screen.getByText('Draft')).toBeInTheDocument();
      expect(screen.getByText('Archived')).toBeInTheDocument();

      // Check attachment link
      expect(screen.getByText('Attachment')).toBeInTheDocument();
    });

    it('should filter notices by status (DRAFT, PUBLISHED, ARCHIVED)', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { success: true, data: mockNotices },
      });

      render(
        <ToastProvider>
          <BrowserRouter>
            <NoticesSection />
          </BrowserRouter>
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Fall Semester Final Exam Schedule')).toBeInTheDocument();
      });

      const statusFilter = screen.getByTestId('notice-status-filter');

      // Filter to DRAFT only
      fireEvent.change(statusFilter, { target: { value: 'DRAFT' } });
      expect(screen.getByText('Draft Security Contingency Plan')).toBeInTheDocument();
      expect(screen.queryByText('Fall Semester Final Exam Schedule')).not.toBeInTheDocument();
      expect(screen.queryByText('Spring Gala 2025 Retrospective')).not.toBeInTheDocument();

      // Filter to ARCHIVED only
      fireEvent.change(statusFilter, { target: { value: 'ARCHIVED' } });
      expect(screen.getByText('Spring Gala 2025 Retrospective')).toBeInTheDocument();
      expect(screen.queryByText('Draft Security Contingency Plan')).not.toBeInTheDocument();
    });

    it('should search notices by query text', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { success: true, data: mockNotices },
      });

      render(
        <ToastProvider>
          <BrowserRouter>
            <NoticesSection />
          </BrowserRouter>
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Fall Semester Final Exam Schedule')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('notice-search-input');
      fireEvent.change(searchInput, { target: { value: 'Weather' } });

      expect(screen.getByText('Draft Security Contingency Plan')).toBeInTheDocument();
      expect(screen.queryByText('Fall Semester Final Exam Schedule')).not.toBeInTheDocument();
    });

    it('should create a new notice with Phase 15 fields via modal', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { success: true, data: mockNotices },
      });
      vi.mocked(api.post).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            id: 'not-new-1',
            title: 'New Campus Expansion Blueprint',
            description: 'Architectural overview of new science wing.',
            category: 'ACADEMIC',
            status: 'DRAFT',
          },
        },
      });

      render(
        <ToastProvider>
          <BrowserRouter>
            <NoticesSection />
          </BrowserRouter>
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('create-notice-btn')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('create-notice-btn'));

      // Modal should appear
      expect(screen.getByTestId('notice-form')).toBeInTheDocument();

      fireEvent.change(screen.getByTestId('notice-form-title'), {
        target: { value: 'New Campus Expansion Blueprint' },
      });
      fireEvent.change(screen.getByTestId('notice-form-description'), {
        target: { value: 'Architectural overview of new science wing.' },
      });
      fireEvent.change(screen.getByTestId('notice-form-status'), {
        target: { value: 'DRAFT' },
      });

      fireEvent.click(screen.getByTestId('submit-notice-btn'));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith(
          '/notices',
          expect.objectContaining({
            title: 'New Campus Expansion Blueprint',
            description: 'Architectural overview of new science wing.',
            status: 'DRAFT',
          })
        );
      });
    });

    it('should trigger publish action on a draft notice', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { success: true, data: mockNotices },
      });
      vi.mocked(api.post).mockResolvedValueOnce({
        data: { success: true },
      });

      render(
        <ToastProvider>
          <BrowserRouter>
            <NoticesSection />
          </BrowserRouter>
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('publish-notice-not-102')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('publish-notice-not-102'));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/notices/not-102/publish');
      });
    });

    it('should trigger unpublish and archive actions on a published notice', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { success: true, data: mockNotices },
      });
      vi.mocked(api.post).mockResolvedValue({
        data: { success: true },
      });

      render(
        <ToastProvider>
          <BrowserRouter>
            <NoticesSection />
          </BrowserRouter>
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('unpublish-notice-not-101')).toBeInTheDocument();
        expect(screen.getByTestId('archive-notice-not-101')).toBeInTheDocument();
      });

      // Click Unpublish
      fireEvent.click(screen.getByTestId('unpublish-notice-not-101'));
      expect(api.post).toHaveBeenCalledWith('/notices/not-101/unpublish');

      // Click Archive
      fireEvent.click(screen.getByTestId('archive-notice-not-101'));
      expect(api.post).toHaveBeenCalledWith('/notices/not-101/archive');
    });

    it('should trigger delete notice with confirmation', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { success: true, data: mockNotices },
      });
      vi.mocked(api.delete).mockResolvedValueOnce({
        data: { success: true },
      });

      render(
        <ToastProvider>
          <BrowserRouter>
            <NoticesSection />
          </BrowserRouter>
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('delete-notice-not-101')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('delete-notice-not-101'));

      // Confirmation modal
      expect(screen.getByText('Delete Institutional Notice')).toBeInTheDocument();
      const deleteButtons = screen.getAllByRole('button', { name: /Delete Bulletin/i });
      fireEvent.click(deleteButtons[deleteButtons.length - 1]);

      await waitFor(() => {
        expect(api.delete).toHaveBeenCalledWith('/notices/not-101');
      });
    });
  });

  // =========================================================================
  // 2. EVENT MANAGEMENT (CRUD, LIFECYCLE, SEARCH, FILTER, PAGINATION)
  // =========================================================================
  describe('Admin Events Management Section', () => {
    const mockEvents = [
      {
        id: 'evt-201',
        title: 'Science Olympiad State Finals 2026',
        description: 'Exhibition of student robotics and chemistry research.',
        date: '2026-11-15',
        startTime: '10:00',
        endTime: '16:00',
        location: 'Innovation Quad Atrium',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
        status: 'PUBLISHED',
        isPublic: true,
      },
      {
        id: 'evt-202',
        title: 'Unannounced Faculty Dinner Draft',
        description: 'Planning committee dinner schedule.',
        date: '2026-11-18',
        startTime: '19:00',
        endTime: '21:30',
        location: 'Executive Suite',
        status: 'DRAFT',
        isPublic: false,
      },
      {
        id: 'evt-203',
        title: 'Past 2025 Alumni Luncheon Archive',
        description: 'Historical archive of alumni weekend.',
        date: '2025-10-01',
        startTime: '12:00',
        endTime: '15:00',
        location: 'Founders Court',
        status: 'ARCHIVED',
        isPublic: false,
      },
    ];

    it('should render event cards with date, time, location, image and status badges', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { success: true, data: mockEvents },
      });

      render(
        <ToastProvider>
          <BrowserRouter>
            <EventsSection />
          </BrowserRouter>
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Science Olympiad State Finals 2026')).toBeInTheDocument();
      });

      expect(screen.getByText('Unannounced Faculty Dinner Draft')).toBeInTheDocument();
      expect(screen.getByText('Past 2025 Alumni Luncheon Archive')).toBeInTheDocument();

      // Badges
      expect(screen.getByTestId('event-status-badge-PUBLISHED')).toBeInTheDocument();
      expect(screen.getByTestId('event-status-badge-DRAFT')).toBeInTheDocument();
      expect(screen.getByTestId('event-status-badge-ARCHIVED')).toBeInTheDocument();

      // Location & Time
      expect(screen.getByText('Innovation Quad Atrium')).toBeInTheDocument();
      expect(screen.getByText('10:00 – 16:00')).toBeInTheDocument();
    });

    it('should filter events by status (DRAFT / ARCHIVED)', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { success: true, data: mockEvents },
      });

      render(
        <ToastProvider>
          <BrowserRouter>
            <EventsSection />
          </BrowserRouter>
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Science Olympiad State Finals 2026')).toBeInTheDocument();
      });

      const filter = screen.getByTestId('event-status-filter');
      fireEvent.change(filter, { target: { value: 'DRAFT' } });

      expect(screen.getByText('Unannounced Faculty Dinner Draft')).toBeInTheDocument();
      expect(screen.queryByText('Science Olympiad State Finals 2026')).not.toBeInTheDocument();
    });

    it('should schedule new event with all Phase 15 fields via modal', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { success: true, data: mockEvents },
      });
      vi.mocked(api.post).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            id: 'evt-new-1',
            title: 'Robotics Workshop',
            description: 'Hands on coding and Arduino builds.',
            date: '2026-12-01',
            startTime: '10:00',
            endTime: '14:00',
            location: 'Makerspace Room 102',
            status: 'PUBLISHED',
          },
        },
      });

      render(
        <ToastProvider>
          <BrowserRouter>
            <EventsSection />
          </BrowserRouter>
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('create-event-btn')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('create-event-btn'));
      expect(screen.getByTestId('event-form')).toBeInTheDocument();

      fireEvent.change(screen.getByTestId('event-form-title'), {
        target: { value: 'Robotics Workshop' },
      });
      fireEvent.change(screen.getByTestId('event-form-description'), {
        target: { value: 'Hands on coding and Arduino builds.' },
      });
      fireEvent.change(screen.getByTestId('event-form-date'), {
        target: { value: '2026-12-01' },
      });
      fireEvent.change(screen.getByTestId('event-form-location'), {
        target: { value: 'Makerspace Room 102' },
      });

      fireEvent.click(screen.getByTestId('submit-event-btn'));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith(
          '/events',
          expect.objectContaining({
            title: 'Robotics Workshop',
            location: 'Makerspace Room 102',
            date: '2026-12-01',
          })
        );
      });
    });

    it('should trigger publish, unpublish, archive and delete lifecycle actions on events', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { success: true, data: mockEvents },
      });
      vi.mocked(api.post).mockResolvedValue({ data: { success: true } });
      vi.mocked(api.delete).mockResolvedValue({ data: { success: true } });

      render(
        <ToastProvider>
          <BrowserRouter>
            <EventsSection />
          </BrowserRouter>
        </ToastProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('publish-event-evt-202')).toBeInTheDocument();
      });

      // Publish draft event
      fireEvent.click(screen.getByTestId('publish-event-evt-202'));
      expect(api.post).toHaveBeenCalledWith('/events/evt-202/publish');

      // Unpublish published event
      fireEvent.click(screen.getByTestId('unpublish-event-evt-201'));
      expect(api.post).toHaveBeenCalledWith('/events/evt-201/unpublish');

      // Archive published event
      fireEvent.click(screen.getByTestId('archive-event-evt-201'));
      expect(api.post).toHaveBeenCalledWith('/events/evt-201/archive');

      // Delete event
      fireEvent.click(screen.getByTestId('delete-event-evt-201'));
      expect(screen.getByText('Cancel Academy Event')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /Cancel Event/i }));
      await waitFor(() => {
        expect(api.delete).toHaveBeenCalledWith('/events/evt-201');
      });
    });
  });

  // =========================================================================
  // 3. PUBLIC WEBSITE VISIBILITY (PUBLISHED CONTENT ONLY)
  // =========================================================================
  describe('Public Website Visibility Restrictions', () => {
    it('public events page fetches live events from /events and displays published items', async () => {
      const publicPublishedEvents = [
        {
          id: 'evt-pub-1',
          title: 'Public Open House and Campus Tour',
          category: 'Admissions',
          date: '2026-10-25',
          startTime: '09:00',
          endTime: '13:00',
          location: 'Founders Hall',
          description: 'Explore the modern STEM laboratories and meet academy deans.',
          status: 'PUBLISHED',
          isPublic: true,
          featured: true,
        },
      ];

      vi.mocked(api.get).mockResolvedValueOnce({
        data: { success: true, data: publicPublishedEvents },
      });

      render(
        <ToastProvider>
          <BrowserRouter>
            <EventsPage />
          </BrowserRouter>
        </ToastProvider>
      );

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/events');
        expect(screen.getByText('Public Open House and Campus Tour')).toBeInTheDocument();
      });

      expect(screen.getByText(/Explore the modern STEM laboratories/i)).toBeInTheDocument();
    });
  });
});
