import { Router } from 'express';
import authRoutes from './authRoutes';
import admissionRoutes from './admissionRoutes';
import classRoutes from './classRoutes';
import attendanceRoutes from './attendanceRoutes';
import gradeRoutes from './gradeRoutes';
import announcementRoutes from './announcementRoutes';
import statsRoutes from './statsRoutes';
import { getHealth, getReadiness } from '../controllers/healthController';

const router = Router();

// Health & Readiness Endpoints
router.get('/health', getHealth);
router.get('/ready', getReadiness);

// Subsystem Modules
router.use('/auth', authRoutes);
router.use('/admissions', admissionRoutes);
router.use('/classes', classRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/grades', gradeRoutes);
router.use('/announcements', announcementRoutes);
router.use('/stats', statsRoutes);

export default router;
