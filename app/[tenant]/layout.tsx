 

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
 
import {  Container } from '@mui/material';
import { Header } from '../componets/Header';
 
 

        type Props={
            children:React.ReactNode;
        }
const Layout = async ({children}: Props)=>{
    
 
    return(
        <html lang="pt-br">
        
            <body style={{margin:0}}>
                <Container component="section" maxWidth="lg">
                 
                    <Header />
          {children}
        
                </Container>

            </body>
        </html>
    )
}
export default Layout;