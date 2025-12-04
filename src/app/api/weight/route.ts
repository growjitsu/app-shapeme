import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: NextRequest) {
  try {
    // Log das variáveis de ambiente (sem expor valores sensíveis)
    console.log('🔍 Verificando configuração do Supabase...');
    console.log('URL configurada:', supabaseUrl ? '✓' : '✗');
    console.log('Key configurada:', supabaseAnonKey ? '✓' : '✗');

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { 
          error: 'Configuração do Supabase incompleta',
          details: {
            url: !!supabaseUrl,
            key: !!supabaseAnonKey
          }
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    console.log('🔐 Authorization header:', authHeader ? '✓' : '✗');

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader?.replace('Bearer ', '') || ''
    );

    if (authError || !user) {
      console.error('❌ Erro de autenticação:', authError);
      return NextResponse.json(
        { error: 'Não autenticado', details: authError?.message },
        { status: 401 }
      );
    }

    console.log('✓ Usuário autenticado:', user.id);

    // Parse do body
    const body = await request.json();
    console.log('📦 Payload recebido:', JSON.stringify(body, null, 2));

    const { weight, note } = body;

    if (!weight || isNaN(parseFloat(weight))) {
      return NextResponse.json(
        { error: 'Peso inválido', received: weight },
        { status: 400 }
      );
    }

    // Preparar dados para inserção
    const insertData = {
      user_id: user.id,
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(weight),
      note: note || null,
    };

    console.log('💾 Tentando inserir:', JSON.stringify(insertData, null, 2));

    // Tentar inserir no banco
    const { data, error } = await supabase
      .from('weight_entries')
      .insert([insertData])
      .select();

    if (error) {
      console.error('❌ Erro do Supabase:', JSON.stringify(error, null, 2));
      
      // Verificar se é erro de tabela não existente
      if (error.code === '42P01') {
        return NextResponse.json(
          {
            error: 'Tabela weight_entries não existe no banco de dados',
            solution: 'Execute o SQL de criação da tabela no dashboard do Supabase',
            sqlNeeded: `
CREATE TABLE IF NOT EXISTS weight_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_weight_entries_user_id ON weight_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_entries_date ON weight_entries(date);

-- Habilitar RLS
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver seus próprios registros"
  ON weight_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios registros"
  ON weight_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios registros"
  ON weight_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios registros"
  ON weight_entries FOR DELETE
  USING (auth.uid() = user_id);
            `.trim()
          },
          { status: 500 }
        );
      }

      // Verificar se é erro de permissão RLS
      if (error.code === '42501' || error.message?.includes('policy')) {
        return NextResponse.json(
          {
            error: 'Erro de permissão (RLS)',
            solution: 'Verifique as políticas de segurança da tabela weight_entries',
            details: error.message
          },
          { status: 403 }
        );
      }

      // Erro genérico
      return NextResponse.json(
        {
          error: 'Erro ao inserir no banco de dados',
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    console.log('✅ Peso salvo com sucesso:', data);

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Peso registrado com sucesso!'
    });

  } catch (error: any) {
    console.error('💥 Erro não tratado:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
