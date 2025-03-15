import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { error } from 'console';

export async function POST(request: Request) {

  const session = await getSession();
  
  // // Verificar se o usuário está autenticado e é um admin
  if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
    }


  const { nome, descricao, preco, categoriaId, tenantId,quantidade } = await request.json();

    // Verificar se o tenantId do usuário corresponde ao tenantId da requisição
  if (session.user.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
    }

  try {
    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco,
        categoriaId,
        tenantId,
        quantidade
      },
    });

    return NextResponse.json(produto, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        categoria: true,
        tenant: true,
      },
    });
    return NextResponse.json(produtos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao listar produtos' }, { status: 500 });
}
  }



  export async function PUT(request: Request) {
    const { id, nome, descricao, preco, categoriaId, tenantId } = await request.json();
  
    try {
      const produtoExistente = await prisma.produto.findUnique({
        where:(id),
      })
      if (!produtoExistente){
        return NextResponse.json({error:'Produto não encontrado'},{status: 404})
      }

      const produto = await prisma.produto.update({
        where: { id },
        data: {
          nome,
          descricao,
          preco,
          categoriaId,
          tenantId,
        },
      });
  
      return NextResponse.json(produto, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 });
    }
  }


  export async function DELETE(request: Request) {
     const { id } = await request.json();
  
    try {
      const produtoExistente = await prisma.produto.findUnique({
        where:(id),
      })
      if (!produtoExistente){
        return NextResponse.json({error:'Produto não encontrado'},{status: 404})
      }
      await prisma.produto.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: 'Produto removido com sucesso' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao remover produto' }, { status: 500 });
    }
  }