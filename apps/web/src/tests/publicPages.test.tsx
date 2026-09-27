import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/public/HomePage';
import { AboutPage } from '../pages/public/AboutPage';
import { PrincipalMessagePage } from '../pages/public/PrincipalMessagePage';
import { AcademicsPage } from '../pages/public/AcademicsPage';
import { FacultyPage } from '../pages/public/FacultyPage';
import { FacilitiesPage } from '../pages/public/FacilitiesPage';
import { GalleryPage } from '../pages/public/GalleryPage';
import { EventsPage } from '../pages/public/EventsPage';
import { NoticesPage } from '../pages/public/AnnouncementsPage';
import { ContactPage } from '../pages/public/ContactPage';
import { ToastProvider } from '../components/ui/Toast';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ToastProvider>
      <BrowserRouter>{component}</BrowserRouter>
    </ToastProvider>
  );
};

describe('Public Website — Critical Pages Test Suite', () => {
  // 1. Home Page
  describe('Home Page (/)', () => {
    it('renders hero title, key admission CTA and academic statistics', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText(/Where Curious Minds Become/i)).toBeInTheDocument();
      expect(screen.getByText(/Global Leaders/i)).toBeInTheDocument();
      expect(screen.getByText(/100% University Acceptance/i)).toBeInTheDocument();
      expect(screen.getByText(/1 : 8/i)).toBeInTheDocument();
      expect(screen.getByText(/Apply for Admission/i)).toBeInTheDocument();
    });

    it('renders the principal preview and campus facilities showcase', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText(/Dr\. Eleanor Vance/i)).toBeInTheDocument();
      expect(screen.getByText(/Alexander Media Library/i)).toBeInTheDocument();
      expect(screen.getByText(/Championship Stadium/i)).toBeInTheDocument();
    });
  });

  // 2. About Page
  describe('About Page (/about)', () => {
    it('renders academy heritage since 1988 and the 4 core pillars', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/A Tradition of Academic Brilliance/i)).toBeInTheDocument();
      expect(screen.getByText(/The Four Pillars of Oakridge/i)).toBeInTheDocument();
      expect(screen.getByText(/Academic Rigor/i)).toBeInTheDocument();
      expect(screen.getByText(/Moral Character/i)).toBeInTheDocument();
      expect(screen.getByText(/IB World School Accredited/i)).toBeInTheDocument();
    });
  });

  // 3. Principal's Message Page
  describe('Principal Message Page (/principal)', () => {
    it('renders official letter from Dr. Eleanor Vance and credentials', () => {
      renderWithProviders(<PrincipalMessagePage />);
      expect(screen.getByText(/Office of the Head of School/i)).toBeInTheDocument();
      expect(screen.getByText(/Cultivating Minds, Inspiring Character/i)).toBeInTheDocument();
      expect(screen.getByText(/Ph\.D\. Harvard University/i)).toBeInTheDocument();
      expect(screen.getByText(/Executive Credentials/i)).toBeInTheDocument();
    });
  });

  // 4. Academics Page
  describe('Academics Page (/academics)', () => {
    it('renders curriculum division tabs and responds to tab switches', () => {
      renderWithProviders(<AcademicsPage />);
      expect(screen.getByText(/An Inspiring Curriculum for Tomorrow's Leaders/i)).toBeInTheDocument();
      expect(screen.getByText(/Primary Academy/i)).toBeInTheDocument();

      const stemTab = screen.getByRole('button', { name: /stem & robotics hub/i });
      fireEvent.click(stemTab);
      expect(screen.getByText(/Robotics & Applied Artificial Intelligence Hub/i)).toBeInTheDocument();
    });
  });

  // 5. Faculty Page
  describe('Faculty Page (/faculty)', () => {
    it('renders faculty directory, 1:8 ratio stats and filters by department', () => {
      renderWithProviders(<FacultyPage />);
      expect(screen.getByText(/World-Class Educators, Lifelong Mentors/i)).toBeInTheDocument();
      expect(screen.getByText(/Dr\. Arthur Pendelton/i)).toBeInTheDocument();
      expect(screen.getByText(/Sarah Montgomery/i)).toBeInTheDocument();

      // Search faculty input
      const searchInput = screen.getByPlaceholderText(/search faculty or subject/i);
      fireEvent.change(searchInput, { target: { value: 'Physics' } });
      expect(screen.getByText(/Dr\. Arthur Pendelton/i)).toBeInTheDocument();
      expect(screen.queryByText(/Claire Kensington/i)).not.toBeInTheDocument();
    });
  });

  // 6. Facilities Page
  describe('Facilities Page (/facilities)', () => {
    it('renders 40-acre campus facilities and opens tour modal', () => {
      renderWithProviders(<FacilitiesPage />);
      expect(screen.getByText(/An Inspiring Architectural Sanctuary/i)).toBeInTheDocument();
      expect(screen.getByText(/University-Grade STEM & Bio-Chemical Labs/i)).toBeInTheDocument();
      expect(screen.getByText(/Alexander Media Library & Learning Commons/i)).toBeInTheDocument();

      const tourBtn = screen.getByRole('button', { name: /schedule campus walkthrough/i });
      fireEvent.click(tourBtn);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/Schedule an In-Person Campus Walkthrough/i)).toBeInTheDocument();
    });
  });

  // 7. Gallery Page
  describe('Gallery Page (/gallery)', () => {
    it('renders photo cards and opens preview lightbox on click', () => {
      renderWithProviders(<GalleryPage />);
      expect(screen.getByText(/A Glimpse into the Oakridge Experience/i)).toBeInTheDocument();
      const photoCard = screen.getByText(/Historic Cambridge Quad Autumn Morning/i);
      expect(photoCard).toBeInTheDocument();

      fireEvent.click(photoCard);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /close preview/i })).toBeInTheDocument();
    });
  });

  // 8. Events Calendar Page
  describe('Events Page (/events)', () => {
    it('renders master event schedule and triggers remind me toast', () => {
      renderWithProviders(<EventsPage />);
      expect(screen.getByText(/Campus Calendar & Community Events/i)).toBeInTheDocument();
      expect(screen.getByText(/Fall 2026 Admissions Open House/i)).toBeInTheDocument();

      const remindButtons = screen.getAllByRole('button', { name: /remind me/i });
      fireEvent.click(remindButtons[0]);
      expect(screen.getByText(/Event Saved/i)).toBeInTheDocument();
    });
  });

  // 9. Notices / Announcements Page
  describe('Notices Page (/notices)', () => {
    it('renders circulars and filter buttons', async () => {
      renderWithProviders(<NoticesPage />);
      expect(screen.getByText(/Announcements & Circulars/i)).toBeInTheDocument();
      expect(await screen.findByText(/Admissions Cycle 2026-2027/i)).toBeInTheDocument();
    });
  });

  // 10. Contact Page
  describe('Contact Page (/contact)', () => {
    it('renders campus address, telephone direct lines and inquiry form submission', async () => {
      renderWithProviders(<ContactPage />);
      expect(screen.getByText(/We Welcome Your Inquiries/i)).toBeInTheDocument();
      expect(screen.getByText(/450 Academy Way, Cambridge Campus/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/your full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

      // Fill in and submit form
      fireEvent.change(screen.getByLabelText(/your full name/i), { target: { value: 'Katherine Sterling' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'k.sterling@example.com' } });
      fireEvent.change(screen.getByLabelText(/inquiry or message details/i), { target: { value: 'Interested in Grade 9 enrollment.' } });

      const submitBtn = screen.getByRole('button', { name: /send inquiry to admissions/i });
      fireEvent.click(submitBtn);

      expect(await screen.findByText(/Inquiry Received/i)).toBeInTheDocument();
    });
  });
});
