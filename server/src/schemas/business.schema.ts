import { z } from 'zod';

export const businessProfileSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  brandName: z.string().min(1, 'Brand name is required'),
  coreOffering: z.string().min(10, 'Please describe your core offering in at least 10 characters'),
  targetAudience: z.string().min(5, 'Target audience is required'),
  brandPersonality: z.string().min(1, 'Brand personality is required'),
});

export type BusinessProfileInput = z.infer<typeof businessProfileSchema>;
