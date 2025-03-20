import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { email, senha } = await request.json();

  try {
    const usuario = await prisma.usuarioFinal.findUnique({
      where: { email },
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha!);

    if (!senhaValida) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    return NextResponse.json({ usuario }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 });
  }
}