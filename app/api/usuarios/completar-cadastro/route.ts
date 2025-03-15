import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { usuarioId, phone, enderecos } = await request.json();

  try {
    const usuario = await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        phone,enderecos
      },
    });

    return NextResponse.json(usuario, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao completar cadastro' }, { status: 500 });
  }
}