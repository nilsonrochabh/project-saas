'use client';   

import React, { useState, FormEvent } from 'react';
 
import { Button,Box, TextField, Typography, Link as MMLink, Alert } from '@mui/material';
import Link from 'next/link';



const Login = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const [loading,setLoaging]=useState(false)

   

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(!email){
      setError("Preencha os campos");
      return;
    }
    setError('');
    setLoaging(true);

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setLoaging(false)
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    }
  };
    
    
  return (
    <>
    <Typography component="p" sx={{textAlign:'center',mt:2,color:'#555'}}>Recuperar Senha </Typography>
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
      
      <Button
        type='submit'
        variant='contained'
        fullWidth
        disabled={loading}
        >{loading ?'Carregando...': 'Recuperar'} </Button>
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

    

export default Login;