import GoogleProvider from 'next-auth/providers/google';
import { NuxtAuthHandler } from '#auth';

const providers = [];
const { NODE_ENV, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET } =
  useRuntimeConfig();

const googleProviderConfig = {
  clientId: NODE_ENV === 'production' ? GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
  clientSecret: NODE_ENV === 'production' ? GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
  async profile(profile: { email: string; name: string; picture: string }) {
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
};

if (NODE_ENV === 'production') {
  providers.push(GoogleProvider({
    clientId: GOOGLE_CLIENT_ID!,
    clientSecret: GOOGLE_CLIENT_SECRET!,
    profile: googleProviderConfig.profile as any
  }));
} else {
  // @ts-expect-error You need to use .default here for it to work during SSR
  providers.push(GoogleProvider.default({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    profile: googleProviderConfig.profile
  }));
}

export default NuxtAuthHandler({
  secret: AUTH_SECRET,
  providers,
  pages: {
    signIn: '/login',
    error: '/unauthorized'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.permissions = user.permissions;
        token.roles = user.roles;
        token.defaultRoute = await getDefaultRouteByUserId(user.id);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.permissions = token.permissions as string[];
        session.user.roles = token.roles;
        session.user.defaultRoute = token.defaultRoute as string;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        if (!profile?.email?.endsWith('@hcmut.edu.vn') && !profile?.email?.endsWith('@gmail.com')) {
          throw new Error('UNAUTHORIZED_DOMAIN');
        }
        return true;
      }
      return false;
    },
  },
});
