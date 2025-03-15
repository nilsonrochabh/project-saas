import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { nome, phone, email, senha, tenantId, role } = await request.json();

  try {
    // Verificar se o e-mail já está cadastrado
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
      include:{tenantUsuarios:true},
    });

    if (usuarioExistente) {
      // Se o usuário já existe, apenas associar ao novo tenant
      await prisma.tenantUsuario.create({
        data: {
          usuarioId: usuarioExistente.id,
          tenantId,
          role,
        },
      });

      return NextResponse.json({ message: 'Usuário associado ao tenant' }, { status: 200 });
    }

    // Criptografar a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Criar o usuário e associar ao tenant
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        phone,
        email,
        senha: senhaCriptografada,
        role,  // Adicione o role diretamente aqui
        tenant: {  // Configure o tenant desta forma
          connect: {
            id: tenantId
          }
        }
      },
    });
    // Gerar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role,
        tenantId: usuario.tenantId,
      },
      process.env.JWT_SECRET!, // Chave secreta para assinar o token
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    // Gerar refresh token
    const refreshToken = jwt.sign(
      { id: usuario.id },
      process.env.JWT_REFRESH_SECRET!, // Chave secreta para o refresh token
      { expiresIn: '7d' } // Refresh token expira em 7 dias
    );

    // Salvar o refresh token no banco de dados
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { refreshToken },
    });

    return NextResponse.json({ usuario, token, refreshToken }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        tenant: true,
      },
    });
    return NextResponse.json(usuarios, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao listar usuários' }, { status: 500 });
  }
}

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const tenantId = searchParams.get('tenantId');

//   try {
//     const usuarios = await prisma.usuario.findMany({
//       where: { tenantId: Number(tenantId) },
//       include: {
//         tenant: true,
//       },
//     });
//     return NextResponse.json(usuarios, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Erro ao listar usuários do tenant' }, { status: 500 });
//   }
// }

export async function PUT(request: Request) {
    const { id, nome, phone, email, senha, role, tenantId } = await request.json();
  
    try {
        const usuarioExistente = await prisma.usuario.findUnique({
            where:(id),
          })
          if (!usuarioExistente){
            return NextResponse.json({error:'Usuario não encontrado'},{status: 404})
          }
      const senhaCriptografada = senha ? await bcrypt.hash(senha, 10) : undefined;
  
      const usuario = await prisma.usuario.update({
        where: { id },
        data: {
          nome,
          email,
          phone,
          senha: senhaCriptografada,
          role,
          tenantId: role === 'cliente' ? null : tenantId, // Só associa ao tenant se for admin/funcionário
        },
      });
  
      return NextResponse.json(usuario, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
    }
  }

  export async function DELETE(request: Request) {
    const { id } = await request.json();
  
    try {
        const usuarioExistente = await prisma.usuario.findUnique({
            where:(id),
          })
          if (!usuarioExistente){
            return NextResponse.json({error:'Usuario não encontrado'},{status: 404})
          }
      await prisma.usuario.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: 'Usuário removido com sucesso' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao remover usuário' }, { status: 500 });
    }
  }