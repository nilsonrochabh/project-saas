'use client';   

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button,Box, TextField, Typography, Link as MMLink, Alert } from '@mui/material';
import Link from 'next/link';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenants, setTenants] = useState([]); // Para armazenar a lista de tenants (se houver)
  const router = useRouter();
  const [error, setError]=useState('');
  const [loading,setLoaging]=useState(false)

  const handleLoginWithGoogle = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(!email ||!password){
      setError("Preencha os campos");
      return;
    }
    setError('');
    setLoaging(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      setLoaging(false)
      const data = await response.json();

      if (response.ok) {
        // Armazenar o token no localStorage
        localStorage.setItem('token', data.token);

        // Redirecionar para a página inicial do tenant
        if (data.usuario.role === 'admin') {
          router.push(`/${data.usuario.tenantId}/admin/dashboard`);
        } else if (data.usuario.role === 'funcionario') {
          router.push(`/${data.usuario.tenantId}/pedidos`);
        } else {
          router.push(`/${data.usuario.tenantId}/produtos`);
        }
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    }
  };
    
    
  return (
    <>
    <Typography component="p" sx={{textAlign:'center',mt:2,color:'#555'}}>Gerenciamento de pedidos e produtos </Typography>
    <Box component="form" onSubmit={handleLogin} sx={{mt:4}}>
      <TextField  
        label='Email'
          value={email} 
          onChange={(e)=>setEmail(e.target.value)}
          name='email'
          required
          fullWidth
          autoFocus
          sx={{mb:2}}
          disabled={loading}
           />
      <TextField 
      label='Senha'   
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          name='passeword'
          type='password'
          required
          fullWidth 
          sx={{mb:2}}
          disabled={loading}
   
          />
      <Button
        type='submit'
        variant='contained'
        fullWidth
        disabled={loading}
        >{loading ?'Carregando...': 'Entrar'} </Button>
    </Box>
    {error &&
      <Alert variant='filled' severity='error'sx={{mt: 3}}>{error}</Alert>
  
    }
    <Box sx={{mt:3}}>
      <MMLink href="/login/forgot" variant="body2" component={Link}> Esqueceu sua Senha</MMLink>
    </Box>
    <Box sx={{mt:3}}>
      <MMLink href="/google" variant="body2" component={Link}> Login com Google</MMLink>
    </Box>
    </>

);
//  // {/* Exibir lista de tenants para admins */}
//  {tenants.length > 1 && (
//   <Box>
//     <Typography component='h2'>Escolha um Tenant</Typography>
//     <Typography component='ul'>
//       {tenants.map((tenant) => (
//         <Box key={tenant.id}>
//           <button onClick={() => redirectBasedOnRole(tenant)}>
//             {tenant.nome} ({tenant.role})
//           </button>
//         </Box>
//       ))}
//     </Typography>
//   </Box>
// )}
};

    

export default Login;