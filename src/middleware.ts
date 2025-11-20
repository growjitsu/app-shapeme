import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/admin/login'];
  
  // Se é rota pública, permite acesso
  if (publicRoutes.some(route => pathname === route)) {
    return NextResponse.next();
  }

  // Se é rota de admin, permite (tem autenticação própria)
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Para rotas protegidas (/app), verifica autenticação
  if (pathname.startsWith('/app')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Pega o token do cookie
    const token = request.cookies.get('sb-access-token')?.value;
    
    if (!token) {
      // Se não tem token, redireciona para login
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verifica se o token é válido
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        const loginUrl = new URL('/auth/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
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
