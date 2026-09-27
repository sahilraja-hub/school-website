import { Router } from 'express';
import authRoutes from './authRoutes';
import admissionRoutes from './admissionRoutes';
import classRoutes from './classRoutes';
import attendanceRoutes from './attendanceRoutes';
import gradeRoutes from './gradeRoutes';
import announcementRoutes from './announcementRoutes';
import statsRoutes from './statsRoutes';

const router = Router();

// Health check endpoint (for monitoring, Docker, K8s, load balancers)
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    service: 'Oakridge School API',
  });
});

router.use('/auth', authRoutes);
router.use('/admissions', admissionRoutes);
router.use('/classes', classRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/grades', gradeRoutes);
router.use('/announcements', announcementRoutes);
router.use('/stats', statsRoutes);

export default router;
