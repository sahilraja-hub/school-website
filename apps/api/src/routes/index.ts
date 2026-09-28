import { Router } from 'express';
import { getHealth, getReadiness } from '../controllers/healthController';

// 22 Core Production REST Modules
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import studentRoutes from './studentRoutes';
import parentRoutes from './parentRoutes';
import teacherRoutes from './teacherRoutes';
import classRoutes from './classRoutes';
import sectionRoutes from './sectionRoutes';
import subjectRoutes from './subjectRoutes';
import attendanceRoutes from './attendanceRoutes';
import examRoutes from './examRoutes';
import resultRoutes from './resultRoutes';
import homeworkRoutes from './homeworkRoutes';
import timetableRoutes from './timetableRoutes';
import admissionRoutes from './admissionRoutes';
import noticeRoutes from './noticeRoutes';
import eventRoutes from './eventRoutes';
import galleryRoutes from './galleryRoutes';
import documentRoutes from './documentRoutes';
import feeRoutes from './feeRoutes';
import paymentRoutes from './paymentRoutes';
import settingsRoutes from './settingsRoutes';
import auditLogRoutes from './auditLogRoutes';

// Backward compatibility routes
import statsRoutes from './statsRoutes';
import gradeRoutes from './gradeRoutes';
import announcementRoutes from './announcementRoutes';

const router = Router();

// Health & Readiness Endpoints
router.get('/health', getHealth);
router.get('/ready', getReadiness);

// 1. /auth
router.use('/auth', authRoutes);

// 2. /users
router.use('/users', userRoutes);

// 3. /students
router.use('/students', studentRoutes);

// 4. /parents
router.use('/parents', parentRoutes);

// 5. /teachers
router.use('/teachers', teacherRoutes);

// 6. /classes
router.use('/classes', classRoutes);

// 7. /sections
router.use('/sections', sectionRoutes);

// 8. /subjects
router.use('/subjects', subjectRoutes);

// 9. /attendance
router.use('/attendance', attendanceRoutes);

// 10. /exams
router.use('/exams', examRoutes);

// 11. /results
router.use('/results', resultRoutes);

// 12. /homework
router.use('/homework', homeworkRoutes);

// 13. /timetable
router.use('/timetable', timetableRoutes);

// 14. /admissions
router.use('/admissions', admissionRoutes);

// 15. /notices
router.use('/notices', noticeRoutes);

// 16. /events
router.use('/events', eventRoutes);

// 17. /gallery
router.use('/gallery', galleryRoutes);

// 18. /documents
router.use('/documents', documentRoutes);

// 19. /fees
router.use('/fees', feeRoutes);

// 20. /payments
router.use('/payments', paymentRoutes);

// 21. /settings
router.use('/settings', settingsRoutes);

// 22. /audit-logs
router.use('/audit-logs', auditLogRoutes);

// Backward Compatibility Aliases
router.use('/grades', gradeRoutes);
router.use('/announcements', announcementRoutes);
router.use('/stats', statsRoutes);

export default router;
