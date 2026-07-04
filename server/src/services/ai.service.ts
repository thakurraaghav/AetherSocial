import Groq from 'groq-sdk';

// Initialize the Groq SDK
// Note: We use a fallback empty string so the server doesn't crash on boot if the key is missing.
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export class AIService {
  static async generatePost(businessContext: any, platform: string, topic?: string) {
    try {
      const prompt = `
        You are an expert social media manager.
        Generate a post for ${platform}.
        
        Business Context:
        Brand Name: ${businessContext.brandName}
        Industry: ${businessContext.category}
        Core Offering: ${businessContext.coreOffering}
        Target Audience: ${businessContext.targetAudience}
        Brand Tone: ${businessContext.brandPersonality}
        
        Topic/Instructions: ${topic || 'Generate a highly engaging, viral post based on the core offering.'}
        
        Rules:
        - The post must perfectly match the Brand Tone.
        - The post must be optimized for ${platform} (e.g., character limits, formatting, hashtags).
        - You MUST return the result as a valid JSON object exactly matching the schema below.
        
        Output Schema Required:
        {
          "textContent": "The actual text of the post including emojis and hashtags",
          "suggestedImagePrompt": "A highly detailed, cinematic text-to-image prompt to generate an accompanying visual. Do NOT include any text, letters, or words inside the image prompt."
        }
      `;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Groq API Error:', error);
      throw new Error('Failed to generate content with AI');
    }
  }
}
