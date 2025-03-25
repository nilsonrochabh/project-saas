
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { Box, Button, Typography } from '@mui/material';

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
    <Box style={{ padding: '20px' }}>
      <Typography component='h1'>Produtos da {tenantData.nome}</Typography>
      <Typography component="ul">
        {tenantData.produtos.map((produto) => (
          <Typography component='li' key={produto.id} style={{ marginBottom: '20px' }}>
            <Typography component='h2'>{produto.nome}</Typography>
            <Typography component='p'>{produto.descricao}</Typography>
            <Typography component='p'>Preço: R$ {produto.preco.toFixed(2)}</Typography>
            <Typography component='p'>Categoria: {produto.categoria.nome}</Typography>
            <Button onClick={() => adicionarAoCarrinho(produto.id)}>
              Adicionar ao Carrinho
            </Button>
          </Typography>
        ))}
      </Typography>
    </Box>
  );
}