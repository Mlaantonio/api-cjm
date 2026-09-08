// app/api/teste/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const dadosBrutos = await prisma.tbcadastros.findMany(); 

    // Converte qualquer BigInt para String para o JSON aceitar
    const dadosConvertidos = JSON.parse(
      JSON.stringify(dadosBrutos, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return NextResponse.json({ 
      sucesso: true, 
      mensagem: "API funcionando com sucesso!",
      dados: dadosConvertidos 
    });
  } catch (error) {
    return NextResponse.json({ 
      sucesso: false, 
      erro: String(error) 
    }, { status: 500 });
  }
}