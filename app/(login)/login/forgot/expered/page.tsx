"use client"

import { Alert, Link as MLink } from "@mui/material"
import Link from "next/link";

const Page = ()=>{
    return(
        <>
        <Alert variant="filled" severity="warning" sx={{mt:3, mb:3}}>Link inspirou</Alert>
        <MLink href="/login/forgot" componet={Link} variant="button">Esqueci minha senha</MLink>
        </>
    )
}
export default Page;