import { Router } from 'express';
import { getPosts, updateSchedule, deletePost, updatePostText } from '../controllers/calendar.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/posts', getPosts);
router.patch('/schedule', updateSchedule);
router.delete('/posts/:id', deletePost);
router.put('/posts/:id', updatePostText);

export default router;
