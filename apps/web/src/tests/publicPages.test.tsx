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
      expect(screen.getByText(/Fulfilling Dreams/i)).toBeInTheDocument();
      expect(screen.getAllByText(/One at a Time/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/R\.B\.S\.? Residential Public School/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/CBSE/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Online Admission Form/i)).toBeInTheDocument();
    });

    it('renders the principal preview and campus facilities showcase', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getAllByText(/Mr\. Tribhuwan Singh/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Sri Ram Bachan Singh/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Smart Digital Classrooms & Modern Laboratories/i)).toBeInTheDocument();
    });
  });

  // 2. About Page
  describe('About Page (/about)', () => {
    it('renders academy heritage since 2008 and the 4 core pillars', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/A Legacy of Quality Education & Sanskar in Vaishali/i)).toBeInTheDocument();
      expect(screen.getByText(/The Four Pillars of RBSRPS/i)).toBeInTheDocument();
      expect(screen.getByText(/CBSE Curriculum Excellence/i)).toBeInTheDocument();
      expect(screen.getByText(/Moral Values & Sanskar/i)).toBeInTheDocument();
      expect(screen.getByText(/Established 2008 – 2009/i)).toBeInTheDocument();
    });
  });

  // 3. Principal's Message Page
  describe('Principal Message Page (/principal)', () => {
    it('renders official letter from Mr. Tribhuwan Singh and credentials', () => {
      renderWithProviders(<PrincipalMessagePage />);
      expect(screen.getByText(/Office of the Principal/i)).toBeInTheDocument();
      expect(screen.getByText(/"Fulfilling Dreams, One Student at a Time\."/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Mr\. Tribhuwan Singh/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/M\.A\., B\.Ed\./i).length).toBeGreaterThan(0);
    });
  });

  // 4. Academics Page
  describe('Academics Page (/academics)', () => {
    it('renders curriculum division tabs and responds to tab switches', () => {
      renderWithProviders(<AcademicsPage />);
      expect(screen.getByText(/Academic Excellence from Foundation to \+2 Senior Secondary/i)).toBeInTheDocument();
      expect(screen.getByText(/Foundational & Primary Stage/i)).toBeInTheDocument();

      const stemTab = screen.getByText(/Senior Secondary \(\+2 Science\)/i).closest('button')!;
      fireEvent.click(stemTab);
      expect(screen.getByText(/PCM & PCB Streams for JEE & NEET/i)).toBeInTheDocument();
    });
  });

  // 5. Faculty Page
  describe('Faculty Page (/faculty)', () => {
    it('renders faculty directory, leadership stats and filters by department', () => {
      renderWithProviders(<FacultyPage />);
      expect(screen.getByText(/Our Educators, Mentors & Leadership/i)).toBeInTheDocument();
      expect(screen.getByText(/Sri Ram Bachan Singh/i)).toBeInTheDocument();
      expect(screen.getByText(/Mr\. Tribhuwan Singh/i)).toBeInTheDocument();

      // Search faculty input
      const searchInput = screen.getByPlaceholderText(/search faculty by name or subject/i);
      fireEvent.change(searchInput, { target: { value: 'Verma' } });
      expect(screen.getByText(/Dr\. Anand Kumar Verma/i)).toBeInTheDocument();
      expect(screen.queryByText(/Mr\. Manoj Kumar Sharma/i)).not.toBeInTheDocument();
    });
  });

  // 6. Facilities Page
  describe('Facilities Page (/facilities)', () => {
    it('renders campus facilities and infrastructure', () => {
      renderWithProviders(<FacilitiesPage />);
      expect(screen.getByText(/A Supportive, Secure & Stimulating Learning Environment/i)).toBeInTheDocument();
      expect(screen.getByText(/Modern Science & Computer Laboratories/i)).toBeInTheDocument();
      expect(screen.getByText(/Separate Boys & Girls Residential Hostels/i)).toBeInTheDocument();
    });
  });

  // 7. Gallery Page
  describe('Gallery Page (/gallery)', () => {
    it('renders photo cards and opens preview lightbox on click', () => {
      renderWithProviders(<GalleryPage />);
      expect(screen.getByText(/A Glimpse into the R\.B\.S\. Experience/i)).toBeInTheDocument();
      const photoCard = screen.getByText(/RBS School Main Academic Block & Campus Grounds/i);
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
      expect(screen.getByText(/Annual Cultural Festival & Classical Music Evening/i)).toBeInTheDocument();

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
      expect(screen.getByText(/We Welcome Your Questions & Visits/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Mahua Ram Rae, Vaishali/i).length).toBeGreaterThan(0);
      expect(screen.getByLabelText(/parent \/ student full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contact phone number/i)).toBeInTheDocument();

      // Fill in and submit form
      fireEvent.change(screen.getByLabelText(/parent \/ student full name/i), { target: { value: 'Ramesh Kumar' } });
      fireEvent.change(screen.getByLabelText(/contact phone number/i), { target: { value: '+91 98765 43210' } });
      fireEvent.change(screen.getByLabelText(/inquiry \/ message details/i), { target: { value: 'Inquiring about Class 11 Science admission and hostel.' } });

      const submitBtn = screen.getByRole('button', { name: /submit inquiry/i });
      fireEvent.click(submitBtn);

      expect(await screen.findByText(/Inquiry Received Successfully/i)).toBeInTheDocument();
    });
  });
});
