import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials!;

        // Buscar o usuário pelo e-mail
        const usuario = await prisma.usuario.findUnique({
          where: { email },
        });

        if (!usuario) {
          throw new Error('Usuário não encontrado');
        }

        // Verificar a senha (se houver)
        if (usuario.senha && !(await bcrypt.compare(password, usuario.senha))) {
          throw new Error('Senha incorreta');
        }

        return usuario;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id; // Adicionar ID do usuário à sessão
      session.user.role = user.role; // Adicionar role do usuário à sessão
      session.user.tenantId = user.tenantId; // Adicionar tenantId do usuário à sessão
      return session;
    },
  },
  pages: {
    signIn: '/login', // Página de login personalizada
  },
};

export default NextAuth(authOptions);