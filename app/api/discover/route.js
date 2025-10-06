import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return Response.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = `Based on the topic "${topic}", identify 3-5 distinct and marketable course or ebook opportunities. Return ONLY a valid JSON array of strings, where each string is a compelling title. Example format: ["Title 1", "Title 2", "Title 3"]`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a market research analyst specializing in identifying high-potential course and ebook opportunities. Always respond with valid JSON arrays only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content?.trim();
    
    try {
      const opportunities = JSON.parse(response);
      return Response.json({ opportunities });
    } catch (parseError) {
      console.error('Failed to parse opportunities:', parseError);
      return Response.json({ error: 'Failed to parse opportunities' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in discover endpoint:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}