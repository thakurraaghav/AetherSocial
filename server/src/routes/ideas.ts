import { Router } from 'express';
import { suggestIdeas } from '../controllers/ideas.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/suggest', suggestIdeas);

export default router;
