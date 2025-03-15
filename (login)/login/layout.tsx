"use client";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Box, Container, Typography} from '@mui/material';

type Props={
    children:React.ReactNode;
}
const Layout =({children}: props)=>{
    return(
        <html lang="pt-br">
            <body>
                <Container component="main" maxWidth="xs">
                    <Box>
                        <Typography component="h3" variant="h3"> Acesso ao sistema Interno</Typography>
                    </Box>

                </Container>

            </body>
        </html>
    )
}
export default Layout;