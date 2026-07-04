import { Request, Response } from 'express';
import { contentQueue } from '../workers/content.worker';

export const generateContent = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { targetPlatform, topic } = req.body;

    if (!targetPlatform) {
      res.status(400).json({ error: 'targetPlatform is required' });
      return;
    }

    // Instantly add the job to BullMQ
    const job = await contentQueue.add('generate-post', {
      userId,
      targetPlatform,
      topic
    });

    // Return a success response IMMEDIATELY so the frontend doesn't freeze!
    res.json({
      message: 'Content generation started',
      jobId: job.id,
      status: 'PROCESSING'
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to queue content generation' });
  }
};
