// app/api/minhas-os/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
  try {
    // 1. Pega e valida o cookie de autenticação do usuário
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ sucesso: false, erro: 'Acesso negado. Token não encontrado.' }, { status: 401 });
    }

    let payload;
    try {
      const verified = await jwtVerify(token, SECRET_KEY);
      payload = verified.payload;
    } catch {
      return NextResponse.json({ sucesso: false, erro: 'Sessão inválida ou expirada.' }, { status: 401 });
    }

    const codigoCliente = Number(payload.sub);
    if (!codigoCliente) {
      return NextResponse.json({ sucesso: false, erro: 'Token corrompido.' }, { status: 401 });
    }

    // 2. Busca todas as ordens de serviço pertencentes unicamente a este cliente
    // Opcional: Se quiser incluir detalhes do aparelho ou cor junto, você pode descomentar o 'include' abaixo
    const ordensServico = await prisma.tbos.findMany({
      where: { 
        codcliente: codigoCliente 
      },
      orderBy: {
        datapedido: 'desc' // Mostra as OS mais recentes primeiro
      },
      include: {
        tbaparelhos: true, // Traz os dados do aparelho vinculado, se houver
        tbcores: true,     // Traz os dados da cor, se houver
        tbdefeitos: true   // Traz os dados do defeito relatado, se houver
      }
    });

    // 3. Serialização segura para lidar com objetos DateTime e BigInt que o Prisma possa retornar
    const dadosConvertidos = JSON.parse(
      JSON.stringify(ordensServico, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return NextResponse.json({ 
      sucesso: true, 
      total: dadosConvertidos.length,
      dados: dadosConvertidos 
    });

  } catch (error) {
    return NextResponse.json({ sucesso: false, erro: String(error) }, { status: 500 });
  }
}