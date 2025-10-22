/* eslint-disable @typescript-eslint/no-explicit-any */

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import baseApi from "@/utils/axiosIntance";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await baseApi.post("/users/admin/login", {
            email: credentials?.email,
            password: credentials?.password,
          });

          const data = res.data;
          if (data.message === "success") {
            return {
              id: data.user._id,
              name: data.user.name,
              email: data.user.email,
              credit: data.user.credit,
              token: data.token,
            };
          }
          return null;
        } catch (err) {
          console.error("Login failed:", err);
          return null;
        }

      },
    }),
  ],

  callbacks: {
    async jwt({ token, user } : any) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;
      return session;
    },
  },

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST , handler as PATCH, };
