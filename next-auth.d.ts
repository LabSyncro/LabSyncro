import type { DefaultUser, DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    permissions: string[];
    roles: {
      name: string;
      key: string;
    }[];
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      image?: string;
      name: string;
      email: string;
      permissions: string[];
      roles: {
        name: string;
        key: string;
      }[];
      defaultRoute?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    permissions: string[];
    roles: {
      name: string;
      key: string;
    }[];
  }
}
