import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/admin/login'];
  
  // Se é rota pública, permite acesso
  if (publicRoutes.some(route => pathname === route)) {
    return res;
  }

  // Se é rota de admin, permite (tem autenticação própria)
  if (pathname.startsWith('/admin')) {
    return res;
  }

  // Para rotas protegidas (/app), verifica autenticação
  if (pathname.startsWith('/app')) {
    const supabase = createMiddlewareClient({ req: request, res });
    
    try {
      // Verifica se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Se não tem sessão, redireciona para login
        const loginUrl = new URL('/auth/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error('Erro no middleware:', error);
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
