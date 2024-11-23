import type { DefaultUser, DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    permissions: string[];
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      image?: string;
      permissions: string[];
    };
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken` */
  interface JWT {
    id: string;
    permissions: string[];
  }
}
