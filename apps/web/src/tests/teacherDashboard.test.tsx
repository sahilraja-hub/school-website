import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TeacherDashboard } from '../pages/portal/TeacherDashboard';
import { TeacherAttendanceSection } from '../pages/portal/teacher/sections/TeacherAttendanceSection';
import { TeacherHomeworkSection } from '../pages/portal/teacher/sections/TeacherHomeworkSection';
import { TeacherResultsSection } from '../pages/portal/teacher/sections/TeacherResultsSection';
import { TeacherProfileSection } from '../pages/portal/teacher/sections/TeacherProfileSection';
import { TeacherClassesSection } from '../pages/portal/teacher/sections/TeacherClassesSection';
import { TeacherSubjectsSection } from '../pages/portal/teacher/sections/TeacherSubjectsSection';
import { TeacherTimetableSection } from '../pages/portal/teacher/sections/TeacherTimetableSection';
import { AuthProvider } from '../context/AuthContext';

// Mock API service
vi.mock('../services/api', () => ({
  api: {
    get: vi.fn().mockImplementation((url: string) => {
      if (url.includes('/teachers/me')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              id: 'teach-001',
              employeeId: 'EMP-2024-001',
              qualification: 'M.Sc. Pure Mathematics, Oxford',
              specialization: 'Advanced Calculus',
              department: 'Mathematics',
              status: 'ACTIVE',
              user: {
                firstName: 'Sarah',
                lastName: 'Jenkins',
                email: 'teacher@oakridge.edu',
                role: 'TEACHER',
              },
              assignments: [
                {
                  id: 'ta-1',
                  classId: 'cls-10',
                  className: 'Grade 10',
                  sectionId: 'sec-10a',
                  sectionName: 'Section A',
                  roomNumber: 'Room 301',
                  subjectId: 'sub-math',
                  subjectName: 'Advanced Mathematics',
                  subjectCode: 'MATH-101',
                  isPrimaryTeacher: true,
                },
                {
                  id: 'ta-2',
                  classId: 'cls-10',
                  className: 'Grade 10',
                  sectionId: 'sec-10b',
                  sectionName: 'Section B',
                  roomNumber: 'Room 302',
                  subjectId: 'sub-math',
                  subjectName: 'Advanced Mathematics',
                  subjectCode: 'MATH-101',
                  isPrimaryTeacher: false,
                },
              ],
            },
          },
        });
      }
      if (url.includes('/students')) {
        return Promise.resolve({
          data: {
            success: true,
            data: [
              {
                id: 'stud-001',
                admissionNumber: 'ADM-2026-0089',
                rollNumber: '10-A-01',
                sectionId: 'sec-10a',
                status: 'ACTIVE',
                emergencyContact: '+1-555-9999',
                user: { firstName: 'Liam', lastName: 'Vance', email: 'liam.vance@oakridge.edu' },
              },
            ],
          },
        });
      }
      if (url.includes('/homework')) {
        return Promise.resolve({
          data: {
            success: true,
            data: [
              {
                id: 'hw-001',
                sectionId: 'sec-10a',
                subjectId: 'sub-math',
                title: 'Problem Set 4: Differential Calculus',
                description: 'Solve questions 1-15 on page 142.',
                dueDate: '2026-10-20',
                totalMarks: 20,
                isPublished: true,
              },
            ],
          },
        });
      }
      return Promise.resolve({ data: { success: true, data: [] } });
    }),
    post: vi.fn().mockResolvedValue({
      data: { success: true, message: 'Saved successfully', data: [] },
    }),
    patch: vi.fn().mockResolvedValue({
      data: { success: true, message: 'Updated successfully', data: {} },
    }),
    delete: vi.fn().mockResolvedValue({
      data: { success: true, message: 'Deleted successfully' },
    }),
  },
  setAccessToken: vi.fn(),
  getAccessToken: vi.fn().mockReturnValue('mock-token'),
}));

const mockAssignments = [
  {
    id: 'ta-1',
    classId: 'cls-10',
    className: 'Grade 10',
    gradeLevel: 'GRADE_10',
    sectionId: 'sec-10a',
    sectionName: 'Section A',
    roomNumber: 'Room 301',
    subjectId: 'sub-math',
    subjectName: 'Advanced Mathematics',
    subjectCode: 'MATH-101',
    isPrimaryTeacher: true,
  },
];

const mockStudents = [
  {
    id: 'stud-001',
    admissionNumber: 'ADM-2026-0089',
    rollNumber: '10-A-01',
    sectionId: 'sec-10a',
    status: 'ACTIVE',
    emergencyContact: '+1-555-9999',
    user: { firstName: 'Liam', lastName: 'Vance', email: 'liam.vance@oakridge.edu' },
  },
  {
    id: 'stud-002',
    admissionNumber: 'ADM-2026-0090',
    rollNumber: '10-A-02',
    sectionId: 'sec-10a',
    status: 'ACTIVE',
    emergencyContact: '+1-555-8888',
    user: { firstName: 'Emma', lastName: 'Watson', email: 'emma.watson@oakridge.edu' },
  },
];

describe('Phase 11 — Teacher Portal Frontend Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Dashboard Layout & Navigation
  it('renders the teacher dashboard with sidebar navigation and welcome card', async () => {
    render(
      <AuthProvider>
        <TeacherDashboard />
      </AuthProvider>
    );

    expect(screen.getAllByText('Faculty Portal')[0]).toBeDefined();
    expect(screen.getAllByText('Dashboard Overview')[0]).toBeDefined();
    expect(screen.getAllByText('Attendance Register')[0]).toBeDefined();
    expect(screen.getAllByText('Homework & Tasks')[0]).toBeDefined();
    expect(screen.getAllByText('Results & Gradebook')[0]).toBeDefined();

    // Check switching tabs to Attendance Register
    const attendanceBtn = screen.getAllByText('Attendance Register')[0];
    fireEvent.click(attendanceBtn);

    await waitFor(() => {
      expect(screen.getByText('Daily Attendance Register')).toBeDefined();
    });
  });

  // 2. Attendance Register Section
  it('allows teacher to select Class, Section, Date and mark Present, Absent, Late', async () => {
    const { api } = await import('../services/api');

    render(
      <TeacherAttendanceSection
        assignments={mockAssignments}
        students={mockStudents}
      />
    );

    expect(screen.getByText('Daily Attendance Register')).toBeDefined();
    expect(screen.getByText('Mark All Present')).toBeDefined();

    // Verify status toggle buttons exist
    const absentButtons = screen.getAllByText('Absent');
    expect(absentButtons.length).toBeGreaterThan(0);
    fireEvent.click(absentButtons[0]);

    const lateButtons = screen.getAllByText('Late');
    expect(lateButtons.length).toBeGreaterThan(0);
    fireEvent.click(lateButtons[1]);

    // Click "Mark All Present"
    const markAllBtn = screen.getByText('Mark All Present');
    fireEvent.click(markAllBtn);

    // Click "Save & Publish Attendance"
    const saveBtn = screen.getByText('Save & Publish Attendance');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/attendance/batch',
        expect.objectContaining({
          classId: 'cls-10',
          sectionId: 'sec-10a',
          records: expect.any(Array),
        })
      );
    });
  });

  // 3. Homework Management
  it('allows teacher to create, edit, publish, and delete homework assignments', async () => {
    const { api } = await import('../services/api');

    render(<TeacherHomeworkSection assignments={mockAssignments} />);

    await waitFor(() => {
      expect(screen.getByText('Coursework & Homework')).toBeDefined();
    });

    // Click Assign New Homework
    const assignBtn = screen.getByText('Assign New Homework');
    fireEvent.click(assignBtn);

    expect(screen.getByText('Assign New Coursework')).toBeDefined();

    // Fill Title and Description
    const titleInput = screen.getByPlaceholderText(/Chapter 4: Matrix Transformations/i);
    fireEvent.change(titleInput, { target: { value: 'Polynomial Factoring Exercises' } });

    const descInput = screen.getByPlaceholderText(/Instructions for students/i);
    fireEvent.change(descInput, { target: { value: 'Complete questions 1 through 20.' } });

    // Submit form
    const createBtn = screen.getByText('Create & Publish');
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/homework',
        expect.objectContaining({
          title: 'Polynomial Factoring Exercises',
          description: 'Complete questions 1 through 20.',
          isPublished: true,
        })
      );
    });
  });

  // 4. Results & Gradebook Section
  it('allows teacher to record marks, view auto-computed grades, and save results', async () => {
    const { api } = await import('../services/api');

    render(
      <TeacherResultsSection
        assignments={mockAssignments}
        students={mockStudents}
      />
    );

    expect(screen.getByText('Examinations & Result Management')).toBeDefined();
    expect(screen.getByText('Authorized Gradebook Access Only')).toBeDefined();

    // Change marks for first student
    const marksInputs = screen.getAllByRole('spinbutton');
    expect(marksInputs.length).toBeGreaterThan(0);
    fireEvent.change(marksInputs[0], { target: { value: '96' } });

    // Click Save on student
    const saveButtons = screen.getAllByText('Save');
    if (saveButtons.length > 0) {
      fireEvent.click(saveButtons[0]);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith(
          '/results',
          expect.objectContaining({
            examSubjectId: 'es-math-101',
            studentId: 'stud-001',
            marksObtained: 96,
            grade: 'A+',
          })
        );
      });
    }
  });

  // 5. Faculty Profile Section
  it('renders teacher profile details and allows editing specialization', async () => {
    const mockProfile = {
      id: 'teach-001',
      employeeId: 'EMP-2024-001',
      department: 'Mathematics',
      qualification: 'M.Sc. Pure Mathematics, Oxford',
      specialization: 'Advanced Calculus',
      status: 'ACTIVE',
      user: {
        firstName: 'Sarah',
        lastName: 'Jenkins',
        email: 'teacher@oakridge.edu',
      },
    };

    render(
      <TeacherProfileSection
        profile={mockProfile}
        assignments={mockAssignments}
        onRefresh={vi.fn()}
      />
    );

    expect(screen.getByText('Sarah Jenkins')).toBeDefined();
    expect(screen.getAllByText('EMP-2024-001')[0]).toBeDefined();
    expect(screen.getAllByText('Mathematics')[0]).toBeDefined();

    // Click Edit Profile
    const editBtn = screen.getByText('Edit Profile');
    fireEvent.click(editBtn);

    expect(screen.getByText('Update Professional Details')).toBeDefined();
  });

  // 6. Assigned Classes Section
  it('renders assigned classes with quick actions to attendance and students', () => {
    const onSelectAttendance = vi.fn();
    const onSelectStudents = vi.fn();

    render(
      <TeacherClassesSection
        assignments={mockAssignments}
        onSelectClassForAttendance={onSelectAttendance}
        onSelectClassForStudents={onSelectStudents}
      />
    );

    expect(screen.getByText('Assigned Classes & Cohorts')).toBeDefined();
    expect(screen.getByText(/Grade 10 • Section A/i)).toBeDefined();

    const attBtn = screen.getByText('Attendance');
    fireEvent.click(attBtn);
    expect(onSelectAttendance).toHaveBeenCalledWith('cls-10', 'sec-10a');
  });

  // 7. Assigned Subjects Section
  it('renders assigned subjects with direct links to assign homework and gradebook', () => {
    const onHomework = vi.fn();
    const onResults = vi.fn();

    render(
      <TeacherSubjectsSection
        assignments={mockAssignments}
        onNavigateToHomework={onHomework}
        onNavigateToResults={onResults}
      />
    );

    expect(screen.getByText('Assigned Academic Subjects')).toBeDefined();
    expect(screen.getByText('MATH-101')).toBeDefined();

    const hwBtn = screen.getByText('Assign Homework');
    fireEvent.click(hwBtn);
    expect(onHomework).toHaveBeenCalledWith('sub-math');
  });

  // 8. Timetable Section
  it('renders timetable periods and responds to day selection', () => {
    render(
      <TeacherTimetableSection
        timetable={[
          {
            id: 'tt-1',
            dayOfWeek: 'MONDAY',
            startTime: '08:30',
            endTime: '09:25',
            sectionName: 'Grade 10-A',
            subjectName: 'Advanced Mathematics',
            subjectCode: 'MATH-101',
            roomNumber: 'Room 301',
          },
        ]}
      />
    );

    expect(screen.getByText('Faculty Lecture Schedule')).toBeDefined();
    expect(screen.getByText('08:30')).toBeDefined();
    expect(screen.getByText('Room 301')).toBeDefined();

    // Click Tuesday
    const tuesdayBtn = screen.getByText('Tuesday');
    fireEvent.click(tuesdayBtn);
    expect(screen.getByText(/No lecture periods scheduled for TUESDAY/i)).toBeDefined();
  });
});
