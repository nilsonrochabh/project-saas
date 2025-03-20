import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

interface ProdutosPageProps {
  params: {
    tenant: string;
  };
}

export default async function ProdutosPage({ params }: ProdutosPageProps) {
  const { tenant } = params;
  const session = await getSession();

  if (!session) {
    return <div>Faça login para continuar</div>;
  }

  const tenantData = await prisma.tenant.findUnique({
    where: { slug: tenant },
    include: {
      produtos: {
        include: {
          categoria: true,
        },
      },
    },
  });

  if (!tenantData) {
    return <div>Tenant não encontrado</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Produtos da {tenantData.nome}</h1>
      <ul>
        {tenantData.produtos.map((produto) => (
          <li key={produto.id} style={{ marginBottom: '20px' }}>
            <h2>{produto.nome}</h2>
            <p>{produto.descricao}</p>
            <p>Preço: R$ {produto.preco.toFixed(2)}</p>
            <p>Categoria: {produto.categoria.nome}</p>
            <button onClick={() => adicionarAoCarrinho(produto.id)}>
              Adicionar ao Carrinho
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}