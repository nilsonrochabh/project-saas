import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { usuarioId, tenantId } = await request.json();

  try {
    const usuario = await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        tenantId, // Atualiza o tenantId do cliente
      },
    });

    return NextResponse.json(usuario, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao associar cliente ao tenant' }, { status: 500 });
  }
}