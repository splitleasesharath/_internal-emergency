import { Router } from 'express';
import emergencyRoutes from './emergency.routes';
import communicationRoutes from './communication.routes';
import teamRoutes from './team.routes';
import presetRoutes from './preset.routes';

const router = Router();

router.use('/emergencies', emergencyRoutes);
router.use('/communication', communicationRoutes);
router.use('/team', teamRoutes);
router.use('/presets', presetRoutes);

export default router;
