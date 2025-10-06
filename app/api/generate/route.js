import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { courseTitle, chapterTitle, learningObjectives } = await request.json();

    if (!courseTitle || !chapterTitle || !learningObjectives) {
      return Response.json({ error: 'Course title, chapter title, and learning objectives are required' }, { status: 400 });
    }

    const prompt = `You are an expert author writing a chapter for the book "${courseTitle}". Write the full content for the chapter titled "${chapterTitle}". Cover these key points: ${learningObjectives.join(', ')}. Use markdown for formatting, including headings, lists, and bold text. The tone should be clear, engaging, and practical.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert author and educator who creates engaging, practical content. Always use proper markdown formatting with clear structure, headings, lists, and emphasis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content?.trim();
    
    return Response.json({ content });
  } catch (error) {
    console.error('Error in generate endpoint:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}