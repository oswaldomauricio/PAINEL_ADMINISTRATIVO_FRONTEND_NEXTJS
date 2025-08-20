import type { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      apiToken: string
      login: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    role: string
    token: string
    login: string
  }

  interface JWT {
    userId: string
    role: string
    apiToken: string
    login: string
  }
}
