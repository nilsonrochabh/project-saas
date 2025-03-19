// app/api/reset-password/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { token, newPassword } = await request.json();

  try {
    // 1. Buscar o usuário pelo token de redefinição
    const usuario = await prisma.usuario.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() }, // Verificar se o token ainda é válido
      },
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 400 });
    }

    // 2. Criptografar a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Atualizar a senha e limpar o token de redefinição
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        senha: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: 'Senha redefinida com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return NextResponse.json({ error: 'Erro ao redefinir senha' }, { status: 500 });
  }
}