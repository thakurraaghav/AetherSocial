import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id; // injected by requireAuth middleware
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id: id as string }
    });

    if (!post || post.userId !== userId) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    await prisma.post.delete({
      where: { id: id as string }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

export const updateSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { postId, scheduledAt } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!postId || scheduledAt === undefined) {
      res.status(400).json({ error: 'postId and scheduledAt are required' });
      return;
    }

    // Ensure the post belongs to the user
    const existingPost = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!existingPost || existingPost.userId !== userId) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { 
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? 'SCHEDULED' : 'DRAFT'
      }
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
};

export const updatePostText = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    const { textContent } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!textContent) {
      res.status(400).json({ error: 'textContent is required' });
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id: id as string }
    });

    if (!post || post.userId !== userId) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const updatedPost = await prisma.post.update({
      where: { id: id as string },
      data: { textContent }
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post text:', error);
    res.status(500).json({ error: 'Failed to update post text' });
  }
};
