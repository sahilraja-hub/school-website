import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { SchoolClass } from '../models/SchoolClass';
import { Attendance } from '../models/Attendance';
import { Assignment } from '../models/Grade';
import { Admission } from '../models/Admission';
import { Announcement } from '../models/Announcement';
import { config } from '../config';

export const seedDatabase = async () => {
  console.log('[Seed] Seeding sample data into database...');

  const superAdminHash = await bcrypt.hash('SuperAdmin@123456', 10);
  const passwordHash = await bcrypt.hash('Admin@123456', 10);
  const teacherHash = await bcrypt.hash('Teacher@123456', 10);
  const studentHash = await bcrypt.hash('Student@123456', 10);
  const parentHash = await bcrypt.hash('Parent@123456', 10);

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    SchoolClass.deleteMany({}),
    Attendance.deleteMany({}),
    Assignment.deleteMany({}),
    Admission.deleteMany({}),
    Announcement.deleteMany({}),
  ]);

  // 1. Create Users
  const superAdmin = await User.create({
    firstName: 'Eleanor',
    lastName: 'Vance',
    email: 'superadmin@oakridge.edu',
    passwordHash: superAdminHash,
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 019-2830',
  });

  const admin = await User.create({
    firstName: 'Principal',
    lastName: 'Harrison',
    email: 'admin@oakridge.edu',
    passwordHash,
    role: 'ADMIN',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 019-2831',
  });

  const teacher1 = await User.create({
    firstName: 'Dr. Evelyn',
    lastName: 'Reed',
    email: 'teacher@oakridge.edu',
    passwordHash: teacherHash,
    role: 'TEACHER',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 019-2832',
  });

  const teacher2 = await User.create({
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah.jenkins@oakridge.edu',
    passwordHash: teacherHash,
    role: 'TEACHER',
    avatarUrl: 'https://images.unsplash.com/photo-1580894732488-b570cb9e2469?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 019-2833',
  });

  const student1 = await User.create({
    firstName: 'Liam',
    lastName: 'Vance',
    email: 'student@oakridge.edu',
    passwordHash: studentHash,
    role: 'STUDENT',
    studentId: 'OAK-882190',
    gradeLevel: 'GRADE_11',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 019-2834',
  });

  const student2 = await User.create({
    firstName: 'Emma',
    lastName: 'Watson',
    email: 'emma.watson@oakridge.edu',
    passwordHash: studentHash,
    role: 'STUDENT',
    studentId: 'OAK-882191',
    gradeLevel: 'GRADE_11',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 019-2835',
  });

  const student3 = await User.create({
    firstName: 'Noah',
    lastName: 'Clark',
    email: 'noah.clark@oakridge.edu',
    passwordHash: studentHash,
    role: 'STUDENT',
    studentId: 'OAK-882192',
    gradeLevel: 'GRADE_11',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 019-2836',
  });

  const parent1 = await User.create({
    firstName: 'David',
    lastName: 'Vance',
    email: 'parent@oakridge.edu',
    passwordHash: parentHash,
    role: 'PARENT',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 019-2837',
  });

  // 2. Create Classes
  const classPhysics = await SchoolClass.create({
    name: 'AP Physics C: Mechanics',
    code: 'PHY-401',
    gradeLevel: 'GRADE_11',
    teacherId: teacher1._id,
    roomNumber: 'Science Wing - Lab 304',
    academicYear: '2026-2027',
    studentIds: [student1._id, student2._id, student3._id],
  });

  const classMath = await SchoolClass.create({
    name: 'AP Calculus BC',
    code: 'MTH-402',
    gradeLevel: 'GRADE_11',
    teacherId: teacher1._id,
    roomNumber: 'Math Wing - Room 210',
    academicYear: '2026-2027',
    studentIds: [student1._id, student2._id],
  });

  const classLiterature = await SchoolClass.create({
    name: 'World Literature & Rhetoric',
    code: 'ENG-301',
    gradeLevel: 'GRADE_11',
    teacherId: teacher2._id,
    roomNumber: 'Humanities - Hall 105',
    academicYear: '2026-2027',
    studentIds: [student1._id, student2._id, student3._id],
  });

  // 3. Create Attendance Records
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  await Attendance.create([
    { classId: classPhysics._id, studentId: student1._id, date: today, status: 'PRESENT' },
    { classId: classPhysics._id, studentId: student2._id, date: today, status: 'PRESENT' },
    { classId: classPhysics._id, studentId: student3._id, date: today, status: 'LATE', notes: 'Arrived 10 mins late' },
    { classId: classPhysics._id, studentId: student1._id, date: yesterday, status: 'PRESENT' },
    { classId: classPhysics._id, studentId: student2._id, date: yesterday, status: 'EXCUSED', notes: 'Doctor appointment' },
    { classId: classPhysics._id, studentId: student3._id, date: yesterday, status: 'PRESENT' },
  ]);

  // 4. Create Assignments & Grades
  await Assignment.create([
    {
      classId: classPhysics._id,
      title: 'Lab Report: Two-Dimensional Kinematics & Ballistics',
      description: 'Analyze experimental launch angles, drag coefficients, and compute theoretical vs observed trajectories.',
      dueDate: '2026-10-05',
      maxPoints: 100,
      weight: 20,
      entries: [
        {
          studentId: student1._id,
          pointsEarned: 96,
          letterGrade: 'A',
          feedback: 'Exceptional error analysis and mathematical modeling!',
          submittedAt: new Date(),
        },
        {
          studentId: student2._id,
          pointsEarned: 91,
          letterGrade: 'A-',
          feedback: 'Great diagrams, verify standard deviation formulas.',
          submittedAt: new Date(),
        },
      ],
    },
    {
      classId: classMath._id,
      title: 'Taylor Series & Convergence Test Assessment',
      description: 'Comprehensive evaluation covering radius of convergence, Maclaurin expansion, and alternating series remainder theorem.',
      dueDate: '2026-10-12',
      maxPoints: 50,
      weight: 15,
      entries: [
        {
          studentId: student1._id,
          pointsEarned: 48,
          letterGrade: 'A',
          feedback: 'Flawless proof on problem 4.',
          submittedAt: new Date(),
        },
      ],
    },
  ]);

  // 5. Create Sample Admissions Applications
  await Admission.create([
    {
      applicationNumber: 'ADM-2026-1042',
      studentFirstName: 'Alexander',
      studentLastName: 'Hayes',
      dateOfBirth: '2011-04-18',
      gradeApplyingFor: 'GRADE_9',
      parentName: 'Robert Hayes',
      parentEmail: 'robert.hayes@example.com',
      parentPhone: '+1 (555) 782-9901',
      address: '742 Evergreen Terrace, Springfield',
      previousSchool: 'Springfield Middle Academy',
      status: 'UNDER_REVIEW',
      notes: 'Strong mathematics recommendation. Robotics club captain.',
    },
    {
      applicationNumber: 'ADM-2026-1088',
      studentFirstName: 'Sophia',
      studentLastName: 'Patel',
      dateOfBirth: '2021-08-22',
      gradeApplyingFor: 'KINDERGARTEN',
      parentName: 'Priya & Vikram Patel',
      parentEmail: 'priya.patel@example.com',
      parentPhone: '+1 (555) 349-1120',
      address: '12 Harbor View Road, Seattle',
      status: 'ACCEPTED',
      notes: 'Accepted for Fall 2026 cohort. Welcome packet sent.',
    },
    {
      applicationNumber: 'ADM-2026-1150',
      studentFirstName: 'Lucas',
      studentLastName: 'Ramirez',
      dateOfBirth: '2009-12-05',
      gradeApplyingFor: 'GRADE_11',
      parentName: 'Elena Ramirez',
      parentEmail: 'elena.ramirez@example.com',
      parentPhone: '+1 (555) 998-4431',
      address: '88 Oakwood Blvd, Seattle',
      previousSchool: 'Northwest Prep High',
      status: 'INTERVIEW_SCHEDULED',
      notes: 'Virtual interview scheduled for Thursday at 2:00 PM PST.',
    },
  ]);

  // 6. Create Announcements
  await Announcement.create([
    {
      title: 'Annual STEM & Robotics Innovation Expo 2026',
      content: 'We are thrilled to announce the 2026 Oakridge STEM Expo on November 14th. Over 40 student-led research initiatives, competitive AI models, and robotics demonstrations will be showcased in the Grand Hall.',
      category: 'EVENT',
      isPinned: true,
      authorId: admin._id,
      authorName: 'Principal Harrison',
      targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      publishDate: new Date(),
    },
    {
      title: 'Fall Semester Mid-Term Examination Schedule Released',
      content: 'The official schedule for mid-term assessments is now published on student and parent portals. Please review examination hall assignments and preparation guidelines.',
      category: 'ACADEMIC',
      isPinned: true,
      authorId: admin._id,
      authorName: 'Principal Harrison',
      targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      publishDate: new Date(Date.now() - 86400000),
    },
    {
      title: 'Varsity Soccer Team Advances to State Quarterfinals!',
      content: 'Congratulations to our varsity soccer team for a thrilling 3-1 victory yesterday! The quarterfinal match will be hosted this Saturday at the West Campus Athletic Complex.',
      category: 'SPORTS',
      isPinned: false,
      authorId: teacher2._id,
      authorName: 'Sarah Jenkins',
      targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      publishDate: new Date(Date.now() - 172800000),
    },
  ]);

  console.log('[Seed] Seeding completed successfully!');
};

export const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Seed] No existing users found. Auto-seeding initial database...');
      await seedDatabase();
    } else {
      console.log(`[Seed] Database already initialized with ${userCount} users.`);
    }
  } catch (error) {
    console.warn('[Seed] Could not check or run auto-seed:', (error as Error).message);
  }
};

// If run directly from CLI
if (require.main === module) {
  mongoose.connect(config.mongoUri).then(async () => {
    await seedDatabase();
    await mongoose.disconnect();
    process.exit(0);
  }).catch((err) => {
    console.error('Seed script error:', err);
    process.exit(1);
  });
}
