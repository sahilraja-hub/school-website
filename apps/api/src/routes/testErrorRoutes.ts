import { Router } from 'express';
import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalServerError,
} from '../errors';
import { validateRequest } from '../middleware/validate';
import {
  PaginationQuerySchema,
  IdParamSchema,
  fileMetadataSchema,
  loginInputSchema,
} from '../validators';

const router = Router();

// 1. ValidationError
router.get('/validation', (req, res, next) => {
  next(
    new ValidationError('Validation failed for submitted payload', [
      { field: 'email', message: 'Email address is invalid', code: 'invalid_string', location: 'body' },
      { field: 'age', message: 'Age must be at least 18', code: 'too_small', location: 'body' },
    ])
  );
});

// 2. AuthenticationError
router.get('/authentication', (req, res, next) => {
  next(new AuthenticationError('Authentication required. Missing or expired token.'));
});

// 3. AuthorizationError
router.get('/authorization', (req, res, next) => {
  next(new AuthorizationError('Access denied. Insufficient role permissions for this resource.'));
});

// 4. NotFoundError
router.get('/not-found', (req, res, next) => {
  next(new NotFoundError('The requested student dossier could not be found.'));
});

// 5. ConflictError
router.get('/conflict', (req, res, next) => {
  next(new ConflictError('A record with admission number ADM-2026-001 already exists.'));
});

// 6. RateLimitError
router.get('/rate-limit', (req, res, next) => {
  next(new RateLimitError('Too many requests. Please try again after 15 minutes.'));
});

// 7. InternalServerError
router.get('/internal', (req, res, next) => {
  next(new InternalServerError('A critical database worker failure occurred.'));
});

// 8. Unexpected native runtime exception (verify zero stack trace in production)
router.get('/unexpected-throw', () => {
  throw new Error('Fatal unhandled runtime exception with private stack details');
});

// 9. Secrets scrubbing test
router.get('/secrets-leak', (req, res, next) => {
  const errorWithSecrets = new Error(
    'Connection failed to mongodb://admin:SuperSecretPass123@cluster0.oakridge.edu:27017/school?authSource=admin with Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-ID and hash $2a$12$e8Y5dF139A8Y01Kj.P2OZu5zP1'
  );
  next(errorWithSecrets);
});

// 10. Database Prisma P2002 error simulation
router.get('/prisma-p2002', (req, res, next) => {
  const prismaErr: any = new Error('Unique constraint failed on the fields: (`email`)');
  prismaErr.code = 'P2002';
  prismaErr.name = 'PrismaClientKnownRequestError';
  prismaErr.meta = { target: ['email'] };
  next(prismaErr);
});

// 11. Multi-target validation test (params, query, body, file)
router.post(
  '/validate-full/:id',
  validateRequest({
    params: IdParamSchema,
    query: PaginationQuerySchema,
    body: loginInputSchema,
    file: fileMetadataSchema,
  }),
  (req, res) => {
    res.json({
      success: true,
      message: 'All validations passed successfully',
      data: {
        params: req.params,
        query: req.query,
        body: req.body,
        file: (req as any).file || req.body?.fileMetadata,
      },
    });
  }
);

export default router;
