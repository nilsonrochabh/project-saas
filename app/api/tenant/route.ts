import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

//create tenant
export async function POST(request: Request) {
  const { nome, slug, logoUrl, corPrimaria } = await request.json();

  try {
    const tenant = await prisma.tenant.create({
      data: {
        nome,
        slug,
        logoUrl,
        corPrimaria,
      },
    });

    return NextResponse.json(tenant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar tenant' }, { status: 500 });
  }
}


//show tenant 
export async function GET() {
  try {
    const tenants = await prisma.tenant.findMany();
    return NextResponse.json(tenants, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao listar tenants' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    const { id, nome, slug, logoUrl, corPrimaria } = await request.json();
  
    try {
      // Verificar se o tenant existe
      const tenantExistente = await prisma.tenant.findUnique({
        where: { id },
      });
  
      if (!tenantExistente) {
        return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 });
      }
  
      const tenant = await prisma.tenant.update({
        where: { id },
        data: {
          nome,
          slug,
          logoUrl,
          corPrimaria,
        },
      });
  
      return NextResponse.json(tenant, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao atualizar tenant' }, { status: 500 });
    }
  }

  export async function DELETE(request: Request) {
    const { id } = await request.json();
  
    try {
      // Verificar se o tenant existe
      const tenantExistente = await prisma.tenant.findUnique({
        where: { id },
      });
  
      if (!tenantExistente) {
        return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 });
      }
  
      await prisma.tenant.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: 'Tenant removido com sucesso' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao remover tenant' }, { status: 500 });
    }
  }