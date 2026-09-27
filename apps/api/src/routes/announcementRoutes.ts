import { Router } from 'express';
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { CreateAnnouncementSchema } from '@school/shared';

const router = Router();

// Public / General announcements can be viewed without auth, or personalized with auth if token present
router.get('/', (req, res, next) => {
  // If authorization header exists, attempt authenticate, otherwise proceed public
  if (req.headers.authorization || req.cookies?.accessToken) {
    return authenticate(req, res, next);
  }
  next();
}, getAnnouncements);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'TEACHER'),
  validate(CreateAnnouncementSchema),
  createAnnouncement
);

router.delete('/:id', authenticate, authorizeRoles('ADMIN'), deleteAnnouncement);

export default router;
