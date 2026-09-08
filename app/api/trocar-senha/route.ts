// app/api/trocar-senha/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  try {
    // 1. Pega e valida o cookie de autenticação
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

    // 2. Recebe a senha antiga e a senha nova enviadas pelo front-end
    const { senhaAntiga, senhaNova } = await request.json();

    if (!senhaAntiga || !senhaNova) {
      return NextResponse.json({ sucesso: false, erro: 'Informe a senha antiga e a nova senha.' }, { status: 400 });
    }

    // 3. Busca o cliente no banco para pegar o hash atual
    const cliente = await prisma.tbcadastros.findUnique({
      where: { codigo: codigoCliente },
    });

    if (!cliente || !cliente.senhahash) {
      return NextResponse.json({ sucesso: false, erro: 'Cliente não encontrado.' }, { status: 404 });
    }

    // 4. Confere se a senha antiga digitada bate com o hash salvo no banco
    const senhaAntigaValida = await bcrypt.compare(senhaAntiga, cliente.senhahash);

    if (!senhaAntigaValida) {
      return NextResponse.json({ sucesso: false, erro: 'A senha antiga está incorreta.' }, { status: 401 });
    }

    // 5. Gera um novo hash seguro para a senha nova (custo 10)
    const novoHashSenha = await bcrypt.hash(senhaNova, 10);

    // 6. Atualiza o banco de dados com a nova senha criptografada
    await prisma.tbcadastros.update({
      where: { codigo: codigoCliente },
      data: { senhahash: novoHashSenha },
    });

    return NextResponse.json({ 
      sucesso: true, 
      mensagem: 'Senha alterada com sucesso!' 
    });

  } catch (error) {
    return NextResponse.json({ sucesso: false, erro: String(error) }, { status: 500 });
  }
}