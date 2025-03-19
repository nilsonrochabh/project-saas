import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    // 1. Buscar o usuário pelo e-mail
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { tenantUsuarios: true }, // Incluir tenants associados
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário ou senha não confere' }, { status: 404 });
    }

    // 2. Verificar a senha
    const senhaValida = await bcrypt.compare(password, usuario.senha);
    if (!senhaValida) {
      return NextResponse.json({ error: 'Usuário ou senha não confere' }, { status: 401 });
    }

    // 3. Gerar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role, // Papel do usuário
        tenantId: usuario.tenantId, // Tenant associado
      },
      process.env.JWT_SECRET!, // Chave secreta
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    // 4. Retornar o token e informações do usuário
    return NextResponse.json(
      {
        token,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          role: usuario.role,
          tenantId: usuario.tenantId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 });
  }
}