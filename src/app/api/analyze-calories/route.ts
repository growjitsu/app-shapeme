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
              text: `Analise esta imagem de comida e forneça:
1. Nome do prato/alimento principal
2. Estimativa de calorias totais (em kcal)
3. Nível de confiança da análise (0-1)

Responda APENAS em formato JSON válido, sem markdown:
{
  "foodName": "nome do prato",
  "calories": número_inteiro,
  "confidence": número_decimal_entre_0_e_1
}

Seja preciso e realista nas estimativas. Se houver múltiplos itens, some as calorias totais.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error('Resposta vazia da API');
    }

    // Parse da resposta JSON
    let result;
    try {
      // Remover markdown se existir
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Erro ao fazer parse da resposta:', content);
      throw new Error('Formato de resposta inválido');
    }

    // Validar resposta
    if (!result.foodName || !result.calories || result.confidence === undefined) {
      throw new Error('Resposta incompleta da análise');
    }

    return NextResponse.json({
      foodName: result.foodName,
      calories: Math.round(result.calories),
      confidence: result.confidence,
    });
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
