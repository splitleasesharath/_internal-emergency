import { Router } from 'express';
import { body, param } from 'express-validator';
import * as communicationController from '../controllers/communication.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Send SMS
router.post(
  '/:emergencyId/sms',
  [
    param('emergencyId').isUUID(),
    body('recipientPhone').isMobilePhone('any'),
    body('messageBody').isString().notEmpty(),
  ],
  validate,
  communicationController.sendSMS
);

// Send Email
router.post(
  '/:emergencyId/email',
  [
    param('emergencyId').isUUID(),
    body('recipientEmail').isEmail(),
    body('subject').isString().notEmpty(),
    body('bodyHtml').isString().notEmpty(),
    body('bodyText').isString().notEmpty(),
    body('ccEmails').optional().isArray(),
    body('ccEmails.*').optional().isEmail(),
    body('bccEmails').optional().isArray(),
    body('bccEmails.*').optional().isEmail(),
  ],
  validate,
  communicationController.sendEmail
);

// Get message history
router.get(
  '/:emergencyId/messages',
  [param('emergencyId').isUUID()],
  validate,
  communicationController.getMessageHistory
);

// Get email history
router.get(
  '/:emergencyId/emails',
  [param('emergencyId').isUUID()],
  validate,
  communicationController.getEmailHistory
);

export default router;
