import { useCarrinho } from '@/hooks/useCarrinho';

export default function CarrinhoPage() {
  const { itens, removerItem } = useCarrinho();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Carrinho</h1>
      <ul>
        {itens.map((item) => (
          <li key={item.id} style={{ marginBottom: '20px' }}>
            <h2>{item.nome}</h2>
            <p>Preço: R$ {item.preco.toFixed(2)}</p>
            <button onClick={() => removerItem(item.id)}>Remover</button>
          </li>
        ))}
      </ul>
      <button onClick={() => window.location.href = '/checkout'}>Finalizar Compra</button>
    </div>
  );
}