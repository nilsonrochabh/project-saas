'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CompletarCadastro() {
  const { data: session } = useSession();
  const router = useRouter();
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      alert('Usuário não autenticado');
      return;
    }

    const response = await fetch('/api/usuarios/completar-cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuarioId: session.user.id,
        telefone,
        endereco,
      }),
    });

    if (response.ok) {
      router.push('/'); // Redirecionar para a página inicial
    } else {
      alert('Erro ao completar cadastro');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Completar Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Telefone:
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
        </label>
        <label>
          Endereço:
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
          />
        </label>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}