
import prisma from '@/lib/prisma';

interface TenantPageProps {
  params: {
    tenant: string;
  };
}

export default async function TenantPage({ params }: TenantPageProps) {
 
  
  const {tenant } = params;

  // Buscar dados do tenant no banco de dados
  const tenantData = await prisma.tenant.findUnique({
    where: { slug: tenant },
    include: { produtos: true }, // Incluir produtos relacionados
  });

  if (!tenantData) {
    return <div>Tenant não encontrado</div>;
  }

  return (
    <div style={{ backgroundColor: tenantData.corPrimaria, padding: '20px' }}>
      <h1>{tenantData.nome}</h1>
      {tenantData.logoUrl && (
        <img src={tenantData.logoUrl} alt={`Logo da ${tenantData.nome}`} />
      )}
      <h2>Produtos:</h2>
      <ul>
        {tenantData.produtos.map((produto) => (
          <li key={produto.id}>
            <h3>{produto.nome}</h3>
            <p>{produto.descricao}</p>
            <p>Preço: R$ {produto.preco.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}