import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';
import fs from 'fs';
import path from 'path';
import { prisma } from '../prisma';
import { AIService } from '../services/ai.service';

// Connect to Redis
// Note: In production, you'd use a real Redis URL from your .env
// We default to localhost if not provided
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  family: 0, // Upstash recommended setting to prevent IPv6 DNS resolution issues
});

// Create the Queue so we can add jobs to it from the controller
export const contentQueue = new Queue('ContentGenerationQueue', { connection: connection as any });

// Initialize the Worker to process jobs from the queue
export const contentWorker = new Worker('ContentGenerationQueue', async job => {
  console.log(`[Worker] Started processing job ${job.id}`);

  const { userId, targetPlatform, topic } = job.data;

  try {
    // 1. Fetch the user's Business Context from the database
    const profile = await prisma.businessProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      throw new Error(`Business profile not found for user ${userId}`);
    }

    // 2. Call our AI Service (Google Gemini)
    console.log(`[Worker] Calling Groq API for job ${job.id}...`);
    const aiResult = await AIService.generatePost(profile, targetPlatform, topic);

    // 3. Generate Image via Pollinations.ai (Fallback since HuggingFace is blocked on ISP)
    let finalImageUrl = aiResult.suggestedImagePrompt;
    if (finalImageUrl) {
      console.log(`[Worker] Generating image via Pollinations.ai for job ${job.id}...`);
      try {
        let width = 1024;
        let height = 1024;
        
        const platformUpper = targetPlatform.toUpperCase();
        if (platformUpper === 'INSTAGRAM') {
          width = 1080;
          height = 1350; // 4:5 ratio
        } else if (platformUpper === 'X' || platformUpper === 'TWITTER') {
          width = 1280;
          height = 720; // 16:9 ratio
        }

        const encodedPrompt = encodeURIComponent(finalImageUrl + ", highly detailed, professional, cinematic lighting, 8k resolution, photorealistic");
        const response = await fetch(`https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true`);

        if (!response.ok) {
          throw new Error(`Pollinations API error: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const filename = `post_${job.id}_${Date.now()}.jpg`;
        const filepath = path.join(__dirname, '../../public/images', filename);
        fs.writeFileSync(filepath, buffer);

        finalImageUrl = `http://localhost:3000/images/${filename}`;
      } catch (imageError: any) {
        console.error(`[Worker] Image generation failed: ${imageError.message}. Proceeding without image.`);
        // Keep finalImageUrl as the original prompt so they can still see it
      }
    }

    // 4. Save the generated post to the database
    const post = await prisma.post.create({
      data: {
        userId,
        targetPlatform,
        textContent: aiResult.textContent,
        imageUrl: finalImageUrl,
        status: 'DRAFT'
      }
    });

    console.log(`[Worker] Successfully completed job ${job.id} - Post ID: ${post.id}`);
    return post;

  } catch (error) {
    console.error(`[Worker] Job ${job.id} failed:`, error);
    throw error;
  }
}, { connection: connection as any });

// Handle worker errors globally
contentWorker.on('failed', (job, err) => {
  console.log(`[Worker] Job ${job?.id} has failed with ${err.message}`);
});
