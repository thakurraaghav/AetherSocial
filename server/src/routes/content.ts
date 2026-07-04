import { Router } from 'express';
import { generateContent } from '../controllers/content.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes in this router
router.use(requireAuth);

router.post('/generate', generateContent);

export default router;
