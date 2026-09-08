//app/api/login/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt'; // Biblioteca recomendada para verificar hash de senhas

const prisma = new PrismaClient();
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  try {
    // O cliente envia a senha digitada no formulário React
    const { email, senha } = await request.json();

// 1. Busca o cliente no banco de dados usando o Prisma
const cliente = await prisma.tbcadastros.findFirst({ 
  where: { 
    email: email
  } 
});
    // 2. Verifica se o cliente existe
    if (!cliente) {
      return NextResponse.json({ sucesso: false, erro: 'Cliente não encontrado' }, { status: 401 });
    }

    // 3. Compara a senha digitada com o hash salvo no banco
    const senhaValida = await bcrypt.compare(senha, cliente.senhahash);

    if (!senhaValida) {
      return NextResponse.json({ sucesso: false, erro: 'Senha incorreta' }, { status: 401 });
    }

    // 4. Se a senha bater, gera o token JWT exclusivo para este cliente
    const token = await new SignJWT({ sub: String(cliente.codigo), email: cliente.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(SECRET_KEY);

    // 5. Salva o token em um cookie HttpOnly seguro no navegador
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 1, // 1 hora de sessão
      sameSite: 'strict',
    });

    return NextResponse.json({ 
      sucesso: true, 
      mensagem: 'Login realizado com sucesso!',
      usuario: {
        codigo: cliente.codigo,
        nome: cliente.nome,
        apelido: cliente.apelido
      }
    });
  } catch (error) {
    return NextResponse.json({ sucesso: false, erro: String(error) }, { status: 500 });
  }
}