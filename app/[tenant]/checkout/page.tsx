import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Faça login para continuar</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Checkout</h1>
      <form>
        <label>
          CEP:
          <input type="text" name="cep" />
        </label>
        <label>
          Endereço:
          <input type="text" name="logradouro" />
        </label>
        <button type="submit">Calcular Frete</button>
      </form>
    </div>
  );
}