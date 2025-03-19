// app/api/forgot-password/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendResetEmail } from '@/lib/email'; // Função para enviar e-mail

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    // 1. Verificar se o e-mail existe no banco de dados
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return NextResponse.json({ error: 'E-mail não encontrado' }, { status: 404 });
    }

    // 2. Gerar um token de redefinição de senha
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Expira em 1 hora

    // 3. Salvar o token e a expiração no banco de dados
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { resetToken, resetTokenExpiry },
    });

    // 4. Enviar o e-mail com o link de redefinição de senha
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
    await sendResetEmail(usuario.email, resetUrl);

    return NextResponse.json({ message: 'E-mail de redefinição enviado' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    return NextResponse.json({ error: 'Erro ao solicitar redefinição de senha' }, { status: 500 });
  }
}