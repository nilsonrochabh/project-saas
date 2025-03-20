import { NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await getSession();

  // Verificar se o usuário está autenticado
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');

  // Verificar se o tenantId do usuário corresponde ao tenantId da requisição
  if (session.user.tenantId !== Number(tenantId)) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
  }

  try {
    const pedidos = await prisma.pedido.findMany({
      where: { tenantId: Number(tenantId) },
      include: {
        itens: true,
      },
    });

    return NextResponse.json(pedidos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao listar pedidos' }, { status: 500 });
  }
}