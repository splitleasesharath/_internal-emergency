import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as emergencyController from '../controllers/emergency.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Get all emergencies with optional filters
router.get(
  '/',
  [
    query('status').optional().isString(),
    query('assignedTo').optional().isUUID(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  validate,
  emergencyController.getAllEmergencies
);

// Get specific emergency by ID
router.get(
  '/:id',
  [param('id').isUUID()],
  validate,
  emergencyController.getEmergencyById
);

// Create new emergency report
router.post(
  '/',
  [
    body('reservationId').isUUID(),
    body('reportedById').isUUID(),
    body('emergencyType').isString().notEmpty(),
    body('description').isString().notEmpty(),
    body('photo1Url').optional().isURL(),
    body('photo2Url').optional().isURL(),
  ],
  validate,
  emergencyController.createEmergency
);

// Update emergency report
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('emergencyType').optional().isString(),
    body('description').optional().isString(),
    body('guidanceInstructions').optional().isString(),
    body('status').optional().isIn(['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  ],
  validate,
  emergencyController.updateEmergency
);

// Assign emergency to team member
router.put(
  '/:id/assign',
  [
    param('id').isUUID(),
    body('assignedToId').isUUID(),
    body('guidanceInstructions').optional().isString(),
  ],
  validate,
  emergencyController.assignEmergency
);

// Update emergency status
router.put(
  '/:id/status',
  [
    param('id').isUUID(),
    body('status').isIn(['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  ],
  validate,
  emergencyController.updateStatus
);

// Hide/Show emergency
router.put(
  '/:id/visibility',
  [
    param('id').isUUID(),
    body('isHidden').isBoolean(),
  ],
  validate,
  emergencyController.updateVisibility
);

// Get emergency by agreement number
router.get(
  '/agreement/:agreementNumber',
  [param('agreementNumber').isString()],
  validate,
  emergencyController.getEmergencyByAgreement
);

export default router;
