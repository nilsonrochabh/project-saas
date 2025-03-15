import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Ignorar a rota de login
  if (path === '/login') {
    return NextResponse.next();
  }

  // Verificar se há um tenant na URL
  const tenantSlug = path.split('/')[1];
  if (!tenantSlug) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 });
  }

// Ignorar a rota de criação de usuário
  if (path === '/api/usuarios') {
    return NextResponse.next();
  }

  
  const token = request.headers.get('authorization')?.split(' ')[1]; // Extrair o token do header

  if (!token) {
    return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
  }

  try {
    // Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      role: string;
      tenantId: number;
    };

    // Verificar o tenantId da requisição (se necessário)
    const tenantId = request.headers.get('tenant-id') || request.nextUrl.searchParams.get('tenantId');

    if (tenantId && decoded.tenantId !== Number(tenantId)) {
      return NextResponse.json({ error: 'Acesso não autorizado ao tenant' }, { status: 403 });
    }

    // Adicionar os dados do usuário à requisição
    (request as any).user = decoded;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 });
  }
}

// Configurar as rotas protegidas
export const config = {
  matcher: ['/api/protected/:path*'], // Proteger todas as rotas que começam com /api/protected
};  