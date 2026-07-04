import { Router } from 'express';
import { getProfile, upsertProfile } from '../controllers/business.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes in this router
router.use(requireAuth);

router.get('/', getProfile);
router.post('/', upsertProfile);

export default router;
