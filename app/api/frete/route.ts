import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { bairro, valor, tenantId } = await request.json();

  try {
    const frete = await prisma.frete.create({
      data: {
        bairro,
        valor,
        tenantId,
      },
    });

    return NextResponse.json(frete, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cadastrar frete' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');

  try {
    const fretes = await prisma.frete.findMany({
      where: { tenantId: Number(tenantId) },
    });

    return NextResponse.json(fretes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao listar fretes' }, { status: 500 });
  }
}
export async function PUT(request: Request) {
    const { id, bairro, valor,tenantId } = await request.json();
  
    try {
      const frete = await prisma.frete.update({
        where: { id },
        data: {
          bairro,
          valor,
          tenantId
        },
      });
  
      return NextResponse.json(frete, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao atualizar frete' }, { status: 500 });
    }
  }
  
  export async function DELETE(request: Request) {
    const { id } = await request.json();
  
    try {
      await prisma.frete.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: 'Frete removido com sucesso' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao remover frete' }, { status: 500 });
    }
  }