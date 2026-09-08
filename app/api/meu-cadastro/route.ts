// app/api/meu-cadastro/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
  try {
    // 1. Pega o cookie de autenticação do navegador
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ sucesso: false, erro: 'Acesso negado. Token não encontrado.' }, { status: 401 });
    }

    // 2. Valida a assinatura do token de forma criptográfica
    let payload;
    try {
      const verified = await jwtVerify(token, SECRET_KEY);
      payload = verified.payload;
    } catch {
      return NextResponse.json({ sucesso: false, erro: 'Sessão inválida ou expirada.' }, { status: 401 });
    }

    // O 'sub' guarda o código único do cliente que foi injetado no momento do login seguro
    const codigoCliente = Number(payload.sub);

    if (!codigoCliente) {
      return NextResponse.json({ sucesso: false, erro: 'Token corrompido.' }, { status: 401 });
    }

    // 3. Busca no banco de dados filtrando estritamente pelo código proprietário do token
    const cadastro = await prisma.tbcadastros.findUnique({
      where: { codigo: codigoCliente },
    });

    if (!cadastro) {
      return NextResponse.json({ sucesso: false, erro: 'Cadastro não encontrado.' }, { status: 404 });
    }

    // 4. (Opcional, mas recomendado) Remove o hash da senha antes de retornar os dados para o front-end
    const { senhahash, ...dadosSeguros } = cadastro;

    // Converte eventuais BigInts para string para evitar erros no JSON
    const dadosConvertidos = JSON.parse(
      JSON.stringify(dadosSeguros, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return NextResponse.json({ 
      sucesso: true, 
      dados: dadosConvertidos 
    });

  } catch (error) {
    return NextResponse.json({ sucesso: false, erro: String(error) }, { status: 500 });
  }
}