import 'dotenv/config';
import { PrismaClient, UserRoleEnum, AccountStatusEnum, GenderEnum, GradeLevelEnum, EnrollmentStatusEnum, AttendanceStatusEnum, ExamStatusEnum, SubmissionStatusEnum, DayOfWeekEnum, AdmissionStatusEnum, NoticeCategoryEnum, MediaTypeEnum, FeeFrequencyEnum, InvoiceStatusEnum, PaymentMethodEnum, PaymentStatusEnum } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. ROLES & PERMISSIONS
  console.log('  → Seeding Roles and Permissions...');
  
  const permissionsList = [
    { name: 'users:read', description: 'View user profiles', module: 'USERS' },
    { name: 'users:write', description: 'Create and update users', module: 'USERS' },
    { name: 'students:read', description: 'View student details', module: 'STUDENTS' },
    { name: 'students:write', description: 'Manage students', module: 'STUDENTS' },
    { name: 'teachers:read', description: 'View teacher details', module: 'TEACHERS' },
    { name: 'teachers:write', description: 'Manage teachers', module: 'TEACHERS' },
    { name: 'academics:read', description: 'View classes, sections, subjects', module: 'ACADEMICS' },
    { name: 'academics:write', description: 'Manage classes, sections, subjects', module: 'ACADEMICS' },
    { name: 'attendance:read', description: 'View attendance records', module: 'ATTENDANCE' },
    { name: 'attendance:write', description: 'Record student attendance', module: 'ATTENDANCE' },
    { name: 'exams:read', description: 'View exams and results', module: 'EXAMS' },
    { name: 'exams:write', description: 'Create exams and enter results', module: 'EXAMS' },
    { name: 'fees:read', description: 'View fee structures and invoices', module: 'FINANCE' },
    { name: 'fees:write', description: 'Manage fees and record payments', module: 'FINANCE' },
    { name: 'notices:read', description: 'View notices and events', module: 'COMMUNICATION' },
    { name: 'notices:write', description: 'Publish notices and events', module: 'COMMUNICATION' },
  ];

  const permissions: Record<string, string> = {};
  for (const perm of permissionsList) {
    const p = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
    permissions[perm.name] = p.id;
  }

  const roleDefinitions = [
    { name: UserRoleEnum.SUPER_ADMIN, description: 'Super Administrator with unrestricted access' },
    { name: UserRoleEnum.ADMIN, description: 'School Administrator with administrative access' },
    { name: UserRoleEnum.TEACHER, description: 'Faculty member with teaching and grading access' },
    { name: UserRoleEnum.STUDENT, description: 'Enrolled student with learner portal access' },
    { name: UserRoleEnum.PARENT, description: 'Parent / Guardian with student monitoring access' },
  ];

  const roles: Record<string, string> = {};
  for (const r of roleDefinitions) {
    const createdRole = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: r,
    });
    roles[r.name] = createdRole.id;
  }

  // Assign permissions to Super Admin role
  for (const permId of Object.values(permissions)) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roles[UserRoleEnum.SUPER_ADMIN],
          permissionId: permId,
        },
      },
      update: {},
      create: {
        roleId: roles[UserRoleEnum.SUPER_ADMIN],
        permissionId: permId,
      },
    });
  }

  // 2. USERS
  console.log('  → Seeding Users...');
  const defaultPassword = await bcrypt.hash('Admin@123456', 10);
  const teacherPassword = await bcrypt.hash('Teacher@123456', 10);
  const studentPassword = await bcrypt.hash('Student@123456', 10);
  const parentPassword = await bcrypt.hash('Parent@123456', 10);

  // Super Admin User
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@oakridge.edu' },
    update: {},
    create: {
      email: 'superadmin@oakridge.edu',
      passwordHash: defaultPassword,
      firstName: 'Albus',
      lastName: 'Vance',
      roleId: roles[UserRoleEnum.SUPER_ADMIN],
      status: AccountStatusEnum.ACTIVE,
      emailVerified: true,
      phone: '+1-555-0100',
    },
  });

  // Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@oakridge.edu' },
    update: {},
    create: {
      email: 'admin@oakridge.edu',
      passwordHash: defaultPassword,
      firstName: 'Eleanor',
      lastName: 'Rigby',
      roleId: roles[UserRoleEnum.ADMIN],
      status: AccountStatusEnum.ACTIVE,
      emailVerified: true,
      phone: '+1-555-0101',
    },
  });

  // Teacher Users
  const teacherUser1 = await prisma.user.upsert({
    where: { email: 'sarah.jenkins@oakridge.edu' },
    update: {},
    create: {
      email: 'sarah.jenkins@oakridge.edu',
      passwordHash: teacherPassword,
      firstName: 'Sarah',
      lastName: 'Jenkins',
      roleId: roles[UserRoleEnum.TEACHER],
      status: AccountStatusEnum.ACTIVE,
      emailVerified: true,
      phone: '+1-555-0102',
    },
  });

  const teacherUser2 = await prisma.user.upsert({
    where: { email: 'david.kumar@oakridge.edu' },
    update: {},
    create: {
      email: 'david.kumar@oakridge.edu',
      passwordHash: teacherPassword,
      firstName: 'David',
      lastName: 'Kumar',
      roleId: roles[UserRoleEnum.TEACHER],
      status: AccountStatusEnum.ACTIVE,
      emailVerified: true,
      phone: '+1-555-0103',
    },
  });

  // Parent User
  const parentUser = await prisma.user.upsert({
    where: { email: 'robert.sterling@example.com' },
    update: {},
    create: {
      email: 'robert.sterling@example.com',
      passwordHash: parentPassword,
      firstName: 'Robert',
      lastName: 'Sterling',
      roleId: roles[UserRoleEnum.PARENT],
      status: AccountStatusEnum.ACTIVE,
      emailVerified: true,
      phone: '+1-555-0104',
    },
  });

  // Student User
  const studentUser = await prisma.user.upsert({
    where: { email: 'alex.sterling@oakridge.edu' },
    update: {},
    create: {
      email: 'alex.sterling@oakridge.edu',
      passwordHash: studentPassword,
      firstName: 'Alex',
      lastName: 'Sterling',
      roleId: roles[UserRoleEnum.STUDENT],
      status: AccountStatusEnum.ACTIVE,
      emailVerified: true,
      phone: '+1-555-0105',
    },
  });

  // 3. TEACHER PROFILES
  console.log('  → Seeding Teacher Profiles...');
  const teacher1 = await prisma.teacher.upsert({
    where: { employeeId: 'EMP-2024-001' },
    update: {},
    create: {
      userId: teacherUser1.id,
      employeeId: 'EMP-2024-001',
      qualification: 'M.Sc. Pure Mathematics, Oxford',
      specialization: 'Advanced Calculus & Analytical Geometry',
      department: 'Mathematics',
      joiningDate: new Date('2021-08-01'),
      status: AccountStatusEnum.ACTIVE,
    },
  });

  const teacher2 = await prisma.teacher.upsert({
    where: { employeeId: 'EMP-2024-002' },
    update: {},
    create: {
      userId: teacherUser2.id,
      employeeId: 'EMP-2024-002',
      qualification: 'Ph.D. Experimental Physics, Stanford',
      specialization: 'Quantum Mechanics & Thermodynamics',
      department: 'Sciences',
      joiningDate: new Date('2022-07-15'),
      status: AccountStatusEnum.ACTIVE,
    },
  });

  // 4. PARENT PROFILE
  console.log('  → Seeding Parent Profile...');
  const parent = await prisma.parent.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: {
      userId: parentUser.id,
      occupation: 'Senior Software Architect',
      relationship: 'FATHER',
      emergencyContact: '+1-555-9999',
      address: '742 Evergreen Terrace, Springfield',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62704',
    },
  });

  // 5. STUDENT PROFILE
  console.log('  → Seeding Student Profile...');
  const student = await prisma.student.upsert({
    where: { admissionNumber: 'ADM-2026-0089' },
    update: {},
    create: {
      userId: studentUser.id,
      parentId: parent.id,
      admissionNumber: 'ADM-2026-0089',
      rollNumber: '10-A-01',
      dateOfBirth: new Date('2010-04-12'),
      gender: GenderEnum.MALE,
      bloodGroup: 'O+',
      admissionDate: new Date('2024-06-01'),
      status: AccountStatusEnum.ACTIVE,
      emergencyContact: '+1-555-9999',
      address: '742 Evergreen Terrace, Springfield',
    },
  });

  // 6. CLASSES & SECTIONS
  console.log('  → Seeding Classes & Sections...');
  const class10 = await prisma.class.upsert({
    where: { name_academicYear: { name: 'Grade 10', academicYear: '2026-2027' } },
    update: {},
    create: {
      name: 'Grade 10',
      gradeLevel: GradeLevelEnum.GRADE_10,
      academicYear: '2026-2027',
      description: 'Sophomore secondary high school cohort',
    },
  });

  const section10A = await prisma.section.upsert({
    where: { classId_name: { classId: class10.id, name: 'Section A' } },
    update: {},
    create: {
      name: 'Section A',
      classId: class10.id,
      roomNumber: 'Room 301 - West Wing',
      capacity: 35,
    },
  });

  // 7. SUBJECTS
  console.log('  → Seeding Subjects...');
  const mathSubject = await prisma.subject.upsert({
    where: { code: 'MATH-101' },
    update: {},
    create: {
      name: 'Advanced Mathematics',
      code: 'MATH-101',
      description: 'Functions, Trigonometry, Calculus & Coordinate Geometry',
      credits: 4,
      isElective: false,
    },
  });

  const physicsSubject = await prisma.subject.upsert({
    where: { code: 'PHYS-101' },
    update: {},
    create: {
      name: 'Physics & Mechanics',
      code: 'PHYS-101',
      description: 'Kinematics, Newtonian Dynamics, Optics & Electromagnetism',
      credits: 4,
      isElective: false,
    },
  });

  // 8. TEACHER ASSIGNMENTS
  console.log('  → Seeding Teacher Assignments...');
  await prisma.teacherAssignment.upsert({
    where: {
      teacherId_sectionId_subjectId_academicYear: {
        teacherId: teacher1.id,
        sectionId: section10A.id,
        subjectId: mathSubject.id,
        academicYear: '2026-2027',
      },
    },
    update: {},
    create: {
      teacherId: teacher1.id,
      sectionId: section10A.id,
      subjectId: mathSubject.id,
      academicYear: '2026-2027',
      isClassTeacher: true,
    },
  });

  await prisma.teacherAssignment.upsert({
    where: {
      teacherId_sectionId_subjectId_academicYear: {
        teacherId: teacher2.id,
        sectionId: section10A.id,
        subjectId: physicsSubject.id,
        academicYear: '2026-2027',
      },
    },
    update: {},
    create: {
      teacherId: teacher2.id,
      sectionId: section10A.id,
      subjectId: physicsSubject.id,
      academicYear: '2026-2027',
      isClassTeacher: false,
    },
  });

  // 9. STUDENT ENROLLMENT
  console.log('  → Seeding Student Enrollment...');
  await prisma.studentEnrollment.upsert({
    where: {
      studentId_sectionId_academicYear: {
        studentId: student.id,
        sectionId: section10A.id,
        academicYear: '2026-2027',
      },
    },
    update: {},
    create: {
      studentId: student.id,
      sectionId: section10A.id,
      academicYear: '2026-2027',
      rollNumber: '10-A-01',
      status: EnrollmentStatusEnum.ACTIVE,
      enrolledAt: new Date('2026-08-01'),
    },
  });

  // 10. TIMETABLE
  console.log('  → Seeding Timetable...');
  await prisma.timetable.createMany({
    skipDuplicates: true,
    data: [
      {
        sectionId: section10A.id,
        subjectId: mathSubject.id,
        teacherId: teacher1.id,
        dayOfWeek: DayOfWeekEnum.MONDAY,
        startTime: '08:30',
        endTime: '09:25',
        roomNumber: 'Room 301',
      },
      {
        sectionId: section10A.id,
        subjectId: physicsSubject.id,
        teacherId: teacher2.id,
        dayOfWeek: DayOfWeekEnum.MONDAY,
        startTime: '09:30',
        endTime: '10:25',
        roomNumber: 'Science Lab 2',
      },
    ],
  });

  // 11. ATTENDANCE
  console.log('  → Seeding Attendance...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.attendance.upsert({
    where: {
      studentId_date: {
        studentId: student.id,
        date: today,
      },
    },
    update: {},
    create: {
      studentId: student.id,
      sectionId: section10A.id,
      date: today,
      status: AttendanceStatusEnum.PRESENT,
      remarks: 'Present on time',
      recordedById: teacherUser1.id,
    },
  });

  // 12. EXAM, EXAM SUBJECT, RESULT
  console.log('  → Seeding Exams & Results...');
  const midTermExam = await prisma.exam.upsert({
    where: { id: 'exam-midterm-2026' },
    update: {},
    create: {
      id: 'exam-midterm-2026',
      name: 'Mid-Term Examinations 2026',
      academicYear: '2026-2027',
      term: 'Term 1',
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-10-25'),
      status: ExamStatusEnum.SCHEDULED,
      description: 'First semester comprehensive evaluation',
    },
  });

  const mathExamSubject = await prisma.examSubject.upsert({
    where: {
      examId_subjectId_sectionId: {
        examId: midTermExam.id,
        subjectId: mathSubject.id,
        sectionId: section10A.id,
      },
    },
    update: {},
    create: {
      examId: midTermExam.id,
      subjectId: mathSubject.id,
      sectionId: section10A.id,
      examDate: new Date('2026-10-16T09:00:00Z'),
      maxMarks: 100,
      passMarks: 40,
    },
  });

  await prisma.result.upsert({
    where: {
      examSubjectId_studentId: {
        examSubjectId: mathExamSubject.id,
        studentId: student.id,
      },
    },
    update: {},
    create: {
      examSubjectId: mathExamSubject.id,
      studentId: student.id,
      marksObtained: 94.5,
      grade: 'A+',
      remarks: 'Exemplary problem-solving in calculus section.',
    },
  });

  // 13. HOMEWORK & SUBMISSION
  console.log('  → Seeding Homework & Submissions...');
  const homework = await prisma.homework.create({
    data: {
      sectionId: section10A.id,
      subjectId: mathSubject.id,
      teacherId: teacher1.id,
      title: 'Problem Set 4: Differential Calculus',
      description: 'Solve questions 1-15 on Page 142 of Advanced Mathematics textbook.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      totalMarks: 20,
    },
  });

  await prisma.homeworkSubmission.upsert({
    where: {
      homeworkId_studentId: {
        homeworkId: homework.id,
        studentId: student.id,
      },
    },
    update: {},
    create: {
      homeworkId: homework.id,
      studentId: student.id,
      status: SubmissionStatusEnum.SUBMITTED,
      submittedAt: new Date(),
      content: 'All 15 problems solved step-by-step with graphical plots included.',
    },
  });

  // 14. ADMISSIONS
  console.log('  → Seeding Admission Applications...');
  await prisma.admission.create({
    data: {
      applicationNumber: 'APP-2026-1042',
      applicantFirstName: 'Julian',
      applicantLastName: 'Chen',
      dateOfBirth: new Date('2011-09-22'),
      gender: GenderEnum.MALE,
      parentName: 'Dr. Michael Chen',
      parentEmail: 'mchen@medicalcenter.org',
      parentPhone: '+1-555-0899',
      gradeApplyingFor: GradeLevelEnum.GRADE_9,
      academicYear: '2026-2027',
      status: AdmissionStatusEnum.UNDER_REVIEW,
      previousSchool: 'Lincoln Middle School',
      reviewedById: adminUser.id,
      notes: 'Strong candidate in STEM competitions.',
    },
  });

  // 15. NOTICES & EVENTS
  console.log('  → Seeding Notices & Events...');
  await prisma.notice.create({
    data: {
      title: 'Parent-Teacher Conference Schedule — Term 1',
      content: 'Individual conference slots are now open for scheduling through the Parent Portal. Please book before Friday.',
      category: NoticeCategoryEnum.ACADEMIC,
      targetRole: UserRoleEnum.PARENT,
      isPinned: true,
      authorId: superAdmin.id,
      publishedAt: new Date(),
    },
  });

  await prisma.event.create({
    data: {
      title: 'Annual Science & Innovation Showcase 2026',
      description: 'Student engineering, robotics, and scientific research exhibitions presented by students from Grades 6 through 12.',
      location: 'Grand Auditorium & STEM Quad',
      startDate: new Date('2026-11-12T10:00:00Z'),
      endDate: new Date('2026-11-12T16:00:00Z'),
      isPublic: true,
      organizerId: adminUser.id,
    },
  });

  // 16. GALLERIES & MEDIA
  console.log('  → Seeding Galleries & Media...');
  const gallery = await prisma.gallery.create({
    data: {
      title: 'Campus Life & Architecture',
      slug: 'campus-life-architecture',
      description: 'Photos and architectural views of Oakridge International Academy',
      coverImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
      media: {
        create: [
          {
            title: 'Modern Library Learning Commons',
            url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
            type: MediaTypeEnum.IMAGE,
            fileSize: 1048576,
            mimeType: 'image/jpeg',
            uploadedById: adminUser.id,
          },
          {
            title: 'Advanced Robotics & Physics Lab',
            url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80',
            type: MediaTypeEnum.IMAGE,
            fileSize: 1572864,
            mimeType: 'image/jpeg',
            uploadedById: adminUser.id,
          },
        ],
      },
    },
  });

  // 17. DOCUMENTS
  console.log('  → Seeding Documents...');
  await prisma.document.create({
    data: {
      title: 'Student Code of Conduct & Honor Handbook 2026-2027',
      fileName: 'student_handbook_2026_2027.pdf',
      fileUrl: '/uploads/documents/student_handbook_2026_2027.pdf',
      mimeType: 'application/pdf',
      fileSize: 2450000,
      category: 'HANDBOOK',
      isPublic: true,
      uploadedById: adminUser.id,
    },
  });

  // 18. FEE STRUCTURES, INVOICES & PAYMENTS
  console.log('  → Seeding Fees, Invoices & Payments...');
  const tuitionFee = await prisma.feeStructure.create({
    data: {
      classId: class10.id,
      name: 'Grade 10 Annual Academic Tuition Fee',
      amount: 4500.00,
      frequency: FeeFrequencyEnum.SEMESTER,
      academicYear: '2026-2027',
      description: 'Comprehensive academic tuition including laboratory and library access',
    },
  });

  const invoice = await prisma.invoice.create({
    data: {
      studentId: student.id,
      feeStructureId: tuitionFee.id,
      invoiceNumber: 'INV-2026-00452',
      amount: 4500.00,
      paidAmount: 4500.00,
      balance: 0.00,
      status: InvoiceStatusEnum.PAID,
      dueDate: new Date('2026-09-01'),
      createdById: adminUser.id,
      notes: 'Semester 1 Tuition Fee Paid in Full',
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      paymentNumber: 'PAY-2026-00891',
      amount: 4500.00,
      paymentMethod: PaymentMethodEnum.ONLINE,
      transactionRef: 'TXN-OAK-98421048',
      status: PaymentStatusEnum.SUCCESS,
      paidAt: new Date('2026-08-28T14:30:00Z'),
      notes: 'Processed via Stripe Payment Gateway',
    },
  });

  // 19. AUDIT LOG
  console.log('  → Seeding Audit Log...');
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      action: 'SYSTEM_INITIALIZATION',
      entityType: 'DATABASE_SETUP',
      entityId: 'ROOT',
      details: {
        environment: 'development',
        seedVersion: '1.0.0',
        totalEntities: 27,
        status: 'SUCCESS',
      },
      ipAddress: '127.0.0.1',
      userAgent: 'Prisma Seeder Script',
    },
  });

  console.log('✅ Development database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
