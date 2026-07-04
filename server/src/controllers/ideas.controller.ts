import { Request, Response } from 'express';
import { prisma } from '../prisma';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export const suggestIdeas = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const business = await prisma.businessProfile.findUnique({
      where: { userId }
    });

    if (!business) {
      res.status(404).json({ error: 'Business profile not found. Please complete onboarding.' });
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    // --- FETCH LIVE TRENDS VIA SERPAPI ---
    let liveTrendsContext = '';
    try {
      if (process.env.SERPAPI_API_KEY) {
        const { getJson } = require("serpapi");
        const response = await getJson({
          engine: "google_news",
          q: `${business.category} industry trends`,
          api_key: process.env.SERPAPI_API_KEY,
        });

        if (response.news_results && response.news_results.length > 0) {
          const headlines = response.news_results.slice(0, 5).map((n: any) => n.title).join('\n- ');
          liveTrendsContext = `\nLive News Trends (incorporate these if relevant):\n- ${headlines}`;
        }
      }
    } catch (err) {
      console.warn("SerpAPI fetch failed or missing key. Falling back to internal knowledge.", err);
    }

    const prompt = `
You are an expert social media strategist. Generate 5 highly engaging, unique, and actionable content ideas for a social media post.

Context about the business:
- Brand Name: ${business.brandName}
- Category: ${business.category}
- Core Offering: ${business.coreOffering}
- Target Audience: ${business.targetAudience}
- Brand Personality: ${business.brandPersonality}

Current Date: ${currentDate}${liveTrendsContext}
(Use the current date and live trends to suggest timely/seasonal ideas if relevant, but also include evergreen ideas).

Return EXACTLY a JSON object with an 'ideas' array containing 5 strings. Do not use markdown blocks.
Example format:
{
  "ideas": [
    "Behind the scenes: How we source materials for our new summer collection",
    "3 common myths about [Core Offering] busted",
    "A client success story showing how we solved [common audience problem]"
  ]
}
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const responseText = completion.choices[0]?.message?.content || '{"ideas":[]}';
    const parsed = JSON.parse(responseText);

    res.json(parsed.ideas || []);
  } catch (error) {
    console.error('Error generating ideas:', error);
    res.status(500).json({ error: 'Failed to generate ideas' });
  }
};
