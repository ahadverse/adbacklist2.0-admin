import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      /** Default properties */
      name?: string | null
      email?: string | null
      image?: string | null
      /** Custom properties */
      token?: string
    } & DefaultSession["user"]
  }
}
