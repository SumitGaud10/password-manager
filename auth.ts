import { autho } from "@/actions/authorize";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: autho,
    }),
  ],

  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // `user` is only set on first login
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // attach custom fields from token into session
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
      }
      return session;
    },
  },
});
export const runtime = "nodejs";
