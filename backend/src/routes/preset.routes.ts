import { Router } from 'express';
import * as presetController from '../controllers/preset.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Get preset messages
router.get('/messages', presetController.getPresetMessages);

// Get preset emails
router.get('/emails', presetController.getPresetEmails);

export default router;
