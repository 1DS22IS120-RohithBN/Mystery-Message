// next-auth.d.ts
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Extend the User interface
declare module 'next-auth' {
  interface User {
    _id: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }

  interface Session {
    user: {
      _id: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession['user'];
  }
}

// Extend the JWT interface
declare module 'next-auth/jwt' {
  interface JWT {
    _id: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}
