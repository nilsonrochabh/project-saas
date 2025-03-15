import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    // Buscar o usuário pelo e-mail
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { tenantUsuarios: { include: { tenant: true } } },
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar a senha
    const senhaValida = await bcrypt.compare(password, usuario.senha);
    if (!senhaValida) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    // Retornar os tenants associados ao usuário e seus papéis
    const tenants = usuario.tenantUsuarios.map((tu) => ({
      id: tu.tenant.id,
      nome: tu.tenant.nome,
      slug: tu.tenant.slug,
      role: tu.role, // Papel do usuário no tenant
    }));

    // Gerar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // Retornar os tenants e o token
    return NextResponse.json({ token, tenants }, { status: 200 });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 });
  }
}