import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { businessProfileSchema } from '../schemas/business.schema';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const profile = await prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      res.status(404).json({ error: 'Business profile not found' });
      return;
    }

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch business profile' });
  }
};

export const upsertProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const validatedData = businessProfileSchema.parse(req.body);

    const profile = await prisma.businessProfile.upsert({
      where: { userId },
      update: validatedData,
      create: {
        ...validatedData,
        userId,
      },
    });

    res.json(profile);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to save business profile' });
    }
  }
};
