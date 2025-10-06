import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { opportunityTitle, numChapters } = await request.json();

    if (!opportunityTitle || !numChapters) {
      return Response.json({ error: 'Opportunity title and number of chapters are required' }, { status: 400 });
    }

    const prompt = `Create a course outline for a book titled "${opportunityTitle}". It must have exactly ${numChapters} chapters. For each chapter, provide a "title" and a "summary" (an array of 3-5 strings detailing key learning points). Return ONLY a valid JSON object in this format: { "title": "...", "chapters": [{ "title": "...", "summary": ["...", "..."] }] }`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert course designer and educational content creator. Always respond with valid JSON objects only, following the exact format specified."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content?.trim();
    
    try {
      const outline = JSON.parse(response);
      return Response.json({ outline });
    } catch (parseError) {
      console.error('Failed to parse outline:', parseError);
      return Response.json({ error: 'Failed to parse course outline' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in outline endpoint:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}