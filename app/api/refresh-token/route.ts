import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { refreshToken } = await request.json();

  try {
    // Verificar o refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
      id: number;
    };

    // Buscar o usuário no banco de dados
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
    });

    if (!usuario || usuario.refreshToken !== refreshToken) {
      return NextResponse.json({ error: 'Refresh token inválido' }, { status: 401 });
    }

    // Gerar novo token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role,
        tenantId: usuario.tenantId,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao renovar token' }, { status: 500 });
  }
}