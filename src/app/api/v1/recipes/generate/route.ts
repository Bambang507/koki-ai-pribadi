import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const RequestSchema = z.object({
  craving: z.string().min(3).max(150),
  availableIngredients: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
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

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL as string,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    let aiRecipe;
    try {
      aiRecipe = JSON.parse(response.text || '{}');
    } catch {
      console.error('Failed to parse Gemini response:', response.text);
      return NextResponse.json({ error: 'Gagal memproses respon dari AI' }, { status: 500 });
    }

    // TODO: In a real app, retrieve the user from the authenticated session
    // const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    // For MVP demonstration, we just return the recipe without saving
    // Once Auth is ready, we will use prisma.recipe.create(...)

    return NextResponse.json(
      { 
        message: 'Recipe generated successfully',
        data: aiRecipe
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
