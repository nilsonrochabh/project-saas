import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenants, setTenants] = useState([]); // Para armazenar a lista de tenants (se houver)
  const router = useRouter();

  const handleLoginWithGoogle = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  const handleLogin = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const { token, tenants } = data;

      // Salvar o token no localStorage ou em um estado global
      localStorage.setItem('token', token);

      // Verificar o papel do usuário e redirecionar
      if (tenants.length === 1) {
        // Se o usuário pertence a apenas um tenant, redireciona diretamente
        redirectBasedOnRole(tenants[0]);
      } else {
        // Se o usuário pertence a vários tenants, verificar se é admin
        const isAdmin = tenants.some((tenant) => tenant.role === 'admin');
        if (isAdmin) {
          // Se for admin, exibir a lista de tenants para escolha
          setTenants(tenants);
        } else {
          // Se não for admin, redirecionar para o primeiro tenant
          redirectBasedOnRole(tenants[0]);
        }
      }
    } else {
      alert(data.error || 'Erro ao fazer login');
    }
  };

  const redirectBasedOnRole = (tenant) => {
    const { slug, role } = tenant;

    if (role === 'admin') {
      router.push(`/${slug}/admin/dashboard/`);
    } else if (role === 'funcionario') {
      router.push(`/${slug}/pedidos`);
    } else {
      router.push(`/${slug}/produtos`);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
      <button onClick={handleLoginWithGoogle}>Entrar com Google</button>

      {/* Exibir lista de tenants para admins */}
      {tenants.length > 1 && (
        <div>
          <h2>Escolha um Tenant</h2>
          <ul>
            {tenants.map((tenant) => (
              <li key={tenant.id}>
                <button onClick={() => redirectBasedOnRole(tenant)}>
                  {tenant.nome} ({tenant.role})
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Login;