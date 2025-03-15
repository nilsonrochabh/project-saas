import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const user = (request as any).user; // Dados do usuário decodificados do token

  // Verificar se o usuário pertence ao tenant correto
  const tenantId = request.headers.get('tenant-id') || request.nextUrl.searchParams.get('tenantId');

  if (user.tenantId !== Number(tenantId)) {
    return NextResponse.json({ error: 'Acesso não autorizado ao tenant' }, { status: 403 });
  }

  return NextResponse.json({ message: 'Rota protegida', user }, { status: 200 });
}