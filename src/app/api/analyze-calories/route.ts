import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      );
    }

    // Analisar imagem com GPT-4 Vision
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analise esta imagem de alimento e forneça uma estimativa nutricional detalhada.

IMPORTANTE: Responda APENAS com um objeto JSON válido, sem texto adicional antes ou depois.

Formato da resposta (JSON puro):
{
  "food_name": "nome do alimento em português",
  "calories": número estimado de calorias,
  "protein": gramas de proteína,
  "carbs": gramas de carboidratos,
  "fat": gramas de gordura,
  "confidence": "Alta" ou "Média" ou "Baixa"
}

Seja preciso e realista nas estimativas. Se houver múltiplos alimentos, some os valores totais.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error('Resposta vazia da IA');
    }

    // Extrair JSON da resposta
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Formato de resposta inválido');
    }

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erro ao analisar calorias:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao analisar imagem',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
