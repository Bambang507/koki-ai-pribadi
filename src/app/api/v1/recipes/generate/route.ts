import { NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
  craving: z.string().min(3).max(150),
  availableIngredients: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Konfigurasi server belum lengkap (Groq API Key tidak ditemukan). Pastikan Environment Variables sudah diatur di Vercel.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Input tidak valid', details: parsed.error.format() },
        { status: 400 }
      );
    }
    
    const { craving, availableIngredients } = parsed.data;

    // Prompt for the AI
    const prompt = `You are a 5-star Michelin Chef and a friendly cooking consultant. Create a delicious cooking recipe based on the following constraints:
User Craving / Desired Dish: ${craving}
Available Ingredients: ${availableIngredients && availableIngredients.length > 0 ? availableIngredients.join(', ') : 'None specified (assume they can buy basic ingredients)'}

Return ONLY a valid JSON object with the following structure (in Indonesian language):
{
  "dishName": "string",
  "description": "string",
  "prepTime": "string",
  "ingredients": [
    { "name": "string", "quantity": "string" }
  ],
  "instructions": [
    { "stepNumber": number, "description": "string" }
  ]
}`;

    const modelName = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

    // Call Groq API via fetch (OpenAI compatible)
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API Error:', errorText);
      return NextResponse.json(
        { error: `Terjadi kesalahan pada Groq API: ${groqResponse.statusText}` },
        { status: groqResponse.status }
      );
    }

    const groqData = await groqResponse.json();
    const aiResponseText = groqData.choices?.[0]?.message?.content;

    let aiRecipe;
    try {
      aiRecipe = JSON.parse(aiResponseText || '{}');
    } catch {
      console.error('Failed to parse Groq response:', aiResponseText);
      return NextResponse.json({ error: 'Gagal memproses respon dari AI' }, { status: 500 });
    }

    return NextResponse.json(
      { 
        message: 'Recipe generated successfully',
        data: aiRecipe
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error generating plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: `Terjadi kesalahan saat memanggil AI: ${errorMessage}` },
      { status: 500 }
    );
  }
}
