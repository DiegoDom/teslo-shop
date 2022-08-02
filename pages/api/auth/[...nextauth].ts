import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { dbUsers } from '../../../database';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom login',
      credentials: {
        email: { label: 'Correo electrónico:', type: 'email', placeholder: 'Ingresa tu correo electrónico' },
        password: { label: 'Contraseña:', type: 'password', placeholder: 'Ingresa tu contraseña' },
      },
      async authorize(credentials) {
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
      },
    }),
    // ...add more providers here
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  // Custom pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  session: {
    maxAge: 86400, // 1d
    strategy: 'jwt',
    updateAge: 86400, // 1d
  },
  // Callbacks
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.OAuthToDBUser(user?.email || '', user?.name || '');
            break;
          case 'credentials':
            token.user = user;
            break;
          default:
            break;
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.user = token.user as any;
      return session;
    },
  },
});
