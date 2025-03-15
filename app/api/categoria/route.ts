import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { nome,tenantId } = await request.json();

  try {
    const categoria = await prisma.categoria.create({
      data: {
        nome,
        tenantId
        },
    });

    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany();
    return NextResponse.json(categorias, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao listar categorias' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { id, nome } = await request.json();

  try {
    // Verificar se a categoria existe
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id },
    });

    if (!categoriaExistente) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
    }

    const categoria = await prisma.categoria.update({
      where: { id },
      data: {
        nome,
      },
    });

    return NextResponse.json(categoria, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar categoria' }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
    const { id } = await request.json();
  
    try {
      // Verificar se a categoria existe
      const categoriaExistente = await prisma.categoria.findUnique({
        where: { id },
      });
  
      if (!categoriaExistente) {
        return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
      }
  
      await prisma.categoria.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: 'Categoria removida com sucesso' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao remover categoria' }, { status: 500 });
    }
  }