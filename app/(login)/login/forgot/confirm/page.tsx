'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
 
import { Button,Box, TextField, Typography, Link as MMLink, Alert } from '@mui/material';
import Link from 'next/link';

export default function Page() {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const router = useRouter();
  
  
  const [loading,setLoaging]=useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      setError('Token inválido');
      return;
    }
    if(!newPassword || confirm){
        setError('Preencha os campos');
        return;
    }
    if(newPassword !== confirm){
        setError('Senhas não conferem');
        return;
    }
        setError('');
        setInfo('');
        setLoaging(true);
    

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        router.push('/login'); // Redirecionar para a tela de login
        setLoaging(false);
        setNewPassword('');
        setConfirm('')
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    }
  };

    
  return (
    <>
    <Typography component="p" sx={{textAlign:'center',mt:2,color:'#555'}}>Ola ***USUARIO defina sua senha</Typography>
    <Box component="form" onSubmit={handleSubmit} sx={{mt:4}}>
      <TextField  
        label='Digite sua senha'
          value={newPassword} 
          onChange={(e)=>setNewPassword(e.target.value)}
          name='password'
          type='password'
          required
          fullWidth
          autoFocus
          sx={{mb:2}}
          disabled={loading}
           />
      <TextField  
        label='Confirme a senha'
          value={confirm} 
          onChange={(e)=>setConfirm(e.target.value)}
          name='confirm'
          type='password'
          required
          fullWidth
          autoFocus
          sx={{mb:2}}
          disabled={loading}
           />
      <Button
        type='submit'
        variant='contained'
        fullWidth
        disabled={loading}
        >{loading ?'Carregando...': 'Definir nova senha'} </Button>
    </Box>
    {error &&
      <Alert variant='filled' severity='error'sx={{mt: 3}}>{error}</Alert>
  
    }
      {info &&
      <Alert variant='filled' severity='success'sx={{mt: 3}}>{info}</Alert>
  
    }
    <Box sx={{mt:3}}>
      <MMLink href="/login" variant="body2" component={Link}> Login</MMLink>
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

    
