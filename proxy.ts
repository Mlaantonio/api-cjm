import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'chave_padrao_insegura');

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  // Defina quais caminhos exigem autenticação obrigatória
  const isProtected = pathname.startsWith('/painel') || pathname.startsWith('/api/dados-protegidos');

  if (isProtected) {
    if (!token) {
      return NextResponse.json({ erro: 'Acesso negado. Faça login.' }, { status: 401 });
    }
    try {
      // Valida a assinatura e validade do token do cookie
      await jwtVerify(token, SECRET_KEY);
    } catch {
      return NextResponse.json({ erro: 'Sessão expirada ou inválida.' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/painel/:path*', '/api/dados-protegidos/:path*'],
};