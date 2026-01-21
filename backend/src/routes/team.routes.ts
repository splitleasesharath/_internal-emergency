import { Router } from 'express';
import * as teamController from '../controllers/team.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Get all team members (staff and admin users)
router.get('/', teamController.getTeamMembers);

export default router;
