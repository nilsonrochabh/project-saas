import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const { usuarioId, produtoId, quantidade, tenantId } = await request.json();
  
    try {
      // Verificar se o usuário já tem um carrinho para este tenant
      let carrinho = await prisma.carrinho.findFirst({
        where: { usuarioId, tenantId },
      });
  
      // Se não tiver, criar um carrinho
      if (!carrinho) {
        carrinho = await prisma.carrinho.create({
          data: { usuarioId, tenantId },
        });
      }
  
      // Adicionar item ao carrinho
      const item = await prisma.itemCarrinho.create({
        data: {
          produtoId,
          quantidade,
          carrinhoId: carrinho.id,
          tenantId, // Associar o item ao tenant
        },
      });
  
      return NextResponse.json(item, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao adicionar item ao carrinho' }, { status: 500 });
    }
  }

  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');
    const tenantId = searchParams.get('tenantId');
  
    try {
      const carrinho = await prisma.carrinho.findFirst({
        where: { usuarioId: Number(usuarioId), tenantId: Number(tenantId) },
        include: {
          itens: {
            include: {
              produto: true,
            },
          },
        },
      });
  
      return NextResponse.json(carrinho, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao listar carrinho' }, { status: 500 });
    }
  }
  export async function DELETE(request: Request) {
    const { itemId, tenantId } = await request.json();
  
    try {
      // Verificar se o item pertence ao tenant
      const item = await prisma.itemCarrinho.findUnique({
        where: { id: itemId },
      });
  
      if (!item || item.tenantId !== tenantId) {
        return NextResponse.json({ error: 'Item não encontrado ou não pertence ao tenant' }, { status: 404 });
      }
  
      await prisma.itemCarrinho.delete({
        where: { id: itemId },
      });
  
      return NextResponse.json({ message: 'Item removido do carrinho' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao remover item do carrinho' }, { status: 500 });
    }
  }