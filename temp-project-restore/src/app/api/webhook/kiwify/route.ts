import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Inicializar cliente Supabase com service role key para operações administrativas
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Token do webhook da Kiwify
const KIWIFY_WEBHOOK_TOKEN = '6bk9124j6lp';

// Tipos para os eventos do Kiwify
interface KiwifyWebhookPayload {
  order_id: string;
  order_ref: string;
  product_id: string;
  product_name: string;
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  Producer: {
    name: string;
  };
  commissions: Array<{
    name: string;
    commission_amount: string;
  }>;
  order_status: 'paid' | 'refused' | 'refunded' | 'chargeback';
  sale_amount: string;
  sale_amount_formatted: string;
  created_at: string;
  updated_at: string;
  signature?: string;
}

// Função para verificar o token do webhook (segurança)
function verifyWebhookToken(token: string | null): boolean {
  return token === KIWIFY_WEBHOOK_TOKEN;
}

// Função para processar compra aprovada
async function handlePaidOrder(data: KiwifyWebhookPayload) {
  try {
    // 1. Verificar se o usuário já existe
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.customer.email)
      .single();

    let userId: string;

    if (existingUser) {
      // Usuário já existe, atualizar informações
      userId = existingUser.id;
      await supabase
        .from('users')
        .update({
          name: data.customer.name,
          phone: data.customer.phone,
          subscription_status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
    } else {
      // Criar novo usuário
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: data.customer.email,
          name: data.customer.name,
          phone: data.customer.phone,
          subscription_status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) throw createError;
      userId = newUser.id;
    }

    // 2. Registrar a transação
    await supabase.from('transactions').insert({
      user_id: userId,
      order_id: data.order_id,
      order_ref: data.order_ref,
      product_id: data.product_id,
      product_name: data.product_name,
      amount: parseFloat(data.sale_amount),
      status: data.order_status,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });

    // 3. Enviar email de boas-vindas (opcional - implementar depois)
    // await sendWelcomeEmail(data.customer.email, data.customer.name);

    console.log(`✅ Compra processada com sucesso: ${data.order_id}`);
    return { success: true, userId };
  } catch (error) {
    console.error('❌ Erro ao processar compra:', error);
    throw error;
  }
}

// Função para processar reembolso
async function handleRefundedOrder(data: KiwifyWebhookPayload) {
  try {
    // Atualizar status da transação
    await supabase
      .from('transactions')
      .update({
        status: 'refunded',
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', data.order_id);

    // Desativar assinatura do usuário
    await supabase
      .from('users')
      .update({
        subscription_status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('email', data.customer.email);

    console.log(`✅ Reembolso processado: ${data.order_id}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao processar reembolso:', error);
    throw error;
  }
}

// Função para processar pagamento recusado
async function handleRefusedOrder(data: KiwifyWebhookPayload) {
  try {
    // Registrar tentativa de compra recusada
    await supabase.from('transactions').insert({
      order_id: data.order_id,
      order_ref: data.order_ref,
      product_id: data.product_id,
      product_name: data.product_name,
      amount: parseFloat(data.sale_amount),
      status: 'refused',
      created_at: data.created_at,
      updated_at: data.updated_at,
    });

    console.log(`⚠️ Pagamento recusado: ${data.order_id}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao processar pagamento recusado:', error);
    throw error;
  }
}

// Handler principal do webhook
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar token de autenticação
    const token = request.headers.get('x-kiwify-token') || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!verifyWebhookToken(token)) {
      console.error('❌ Token inválido do webhook');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // 2. Ler o corpo da requisição
    const rawBody = await request.text();
    const data: KiwifyWebhookPayload = JSON.parse(rawBody);

    // 3. Log do evento recebido
    console.log('📥 Webhook recebido:', {
      order_id: data.order_id,
      status: data.order_status,
      customer: data.customer.email,
    });

    // 4. Processar baseado no status do pedido
    let result;
    switch (data.order_status) {
      case 'paid':
        result = await handlePaidOrder(data);
        break;
      case 'refunded':
        result = await handleRefundedOrder(data);
        break;
      case 'refused':
        result = await handleRefusedOrder(data);
        break;
      case 'chargeback':
        result = await handleRefundedOrder(data); // Tratar como reembolso
        break;
      default:
        console.log(`⚠️ Status desconhecido: ${data.order_status}`);
        return NextResponse.json(
          { error: 'Unknown order status' },
          { status: 400 }
        );
    }

    // 5. Retornar sucesso
    return NextResponse.json({
      success: true,
      message: 'Webhook processado com sucesso',
      data: result,
    });
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Método GET para testar se a rota está funcionando
export async function GET() {
  return NextResponse.json({
    message: 'Webhook Kiwify está ativo',
    endpoint: '/api/webhook/kiwify',
    methods: ['POST'],
    status: 'online',
    token_configured: true,
  });
}
