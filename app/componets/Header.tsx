'use client'

import { AppBar, Button, Toolbar, Typography,Box, IconButton, Menu } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"

export const Header=()=>{
    const route = useRouter();   
    const pageTitle = "TESTE"
    const handleLogout =()=>{
        route.push('/login')
    }
    const handleDrawerToggle =()=>{

    }
    return(
        <>
        
        <AppBar component='nav' position="relative" >
            <Toolbar>
                <IconButton
                        color="inherit"
                        edge="start"
                        sx={{display:{sm:'none'}}}
                        onClick={handleDrawerToggle}
                        >
                        <Menu open={true} /> 
                    </IconButton>
                    <Typography
                    component='div'
                    variant="h6"
                    sx={{flexGrow:1, display: {xs:'none', sm: 'block'} }}>
                        <Link href="/" 
                            style={{color:'#fff', textDecoration:'none'}}>
                                {pageTitle}
                        </Link>
                    </Typography>
                    <Box sx={{display:{xs:'none', sm:'block'}}}>
                        <Link href='/pedidos' style={{textDecoration:'none'}}>
                            <Button sx={{color:'#fff'}}>Pedidos</Button>
                        </Link> 
                        <Link href='/produtos' style={{textDecoration:'none'}}>
                            <Button sx={{color:'#fff'}}>Produtos</Button>
                        </Link>
                        <Link href='/categorias' style={{textDecoration:'none'}}>
                            <Button sx={{color:'#fff'}}>Categorias</Button>
                        </Link>
                        <Button onClick={handleLogout} sx={{color:'#fff'}}>Sair</Button>
                    </Box>
                </Toolbar>

        </AppBar>
       </>

    )
}