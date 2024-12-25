import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { NuxtAuthHandler } from '#auth';
import bcrypt from 'bcrypt';

const providers = [];
const { NODE_ENV, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = useRuntimeConfig();

if (NODE_ENV === 'production') {
  providers.push(
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      async profile (profile: { email: string; name: string; picture: string }) {
        const user = await createOrUpdateUser(
          profile.email,
          profile.name,
          profile.picture,
        );

        const permissions = await getUserPermissions(user.id);
        const roles = await getUserRoles(user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          permissions,
          roles,
        };
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // @ts-expect-error production
      async authorize (credentials: { email: string; password: string }) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUserByEmail(credentials.email);
        if (!user?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        const permissions = await getUserPermissions(user.id);
        const roles = await getUserRoles(user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          permissions,
          roles,
        };
      },
    }),
  );
} else {
  providers.push(
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile (profile: { email: string; name: string; picture: string }) {
        const user = await createOrUpdateUser(
          profile.email,
          profile.name,
          profile.picture,
        );

        const permissions = await getUserPermissions(user.id);
        const roles = await getUserRoles(user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          permissions,
          roles,
        };
      },
    }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize (credentials: { email: string; password: string }) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUserByEmail(credentials.email);
        if (!user?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        const permissions = await getUserPermissions(user.id);
        const roles = await getUserRoles(user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          permissions,
          roles,
        };
      },
    }),
  );
}

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  providers,
  callbacks: {
    async jwt ({ token, user }) {
      if (user) {
        token.id = user.id;
        token.permissions = user.permissions;
        token.roles = user.roles;
      }
      return token;
    },
    async session ({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.permissions = token.permissions;
        session.user.roles = token.roles;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
