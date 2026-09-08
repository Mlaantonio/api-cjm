// app/api/minhas-os/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretEnv = process.env.JWT_SECRET;

if (!secretEnv) {
  throw new Error('Erro crítico: A variável de ambiente JWT_SECRET não está definida.');
}

const SECRET_KEY = new TextEncoder().encode(secretEnv);

export default async function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  // 1. Libera o acesso direto e imediato para a rota de login
  if (pathname === '/api/login') {
    return NextResponse.next();
  }

  // 2. Protege todas as outras rotas dentro de /api/ e /painel/
  if (pathname.startsWith('/api') || pathname.startsWith('/painel')) {
    if (!token) {
      return NextResponse.json({ erro: 'Acesso negado. Faça login.' }, { status: 401 });
    }
    
    try {
      // Valida a assinatura criptográfica do token
      await jwtVerify(token, SECRET_KEY);
    } catch {
      return NextResponse.json({ erro: 'Sessão expirada ou inválida.' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// Intercepta de forma global tudo que vai para /api ou /painel
export const config = {
  matcher: ['/api/:path*', '/painel/:path*'],
};S