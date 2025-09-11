import NextAuth from "next-auth/next"

import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        senha: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.senha) {
          return null
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL

        try {
          const response = await fetch(`${baseUrl}/v1/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              login: credentials.login,
              senha: credentials.senha,
            }),
          })

          console.log(response)

          // Se a resposta não for ok (403 Forbidden ou outros erros)
          if (!response.ok) {
            console.error(
              `Erro de autenticação: ${response.status} - ${
                response.statusText
              }`
            )
            return null
          }

          const userData = await response.json()

          // Verifica se a resposta contém os campos esperados
          if (
            userData &&
            userData.token &&
            userData.nome &&
            userData.role &&
            userData.id
          ) {
            return {
              id: userData.id.toString(),
              name: userData.nome,
              role: userData.role,
              token: userData.token,
              login: credentials.login,
            }
          }

          return null
        } catch (error) {
          console.error("Erro na requisição de autenticação:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Primeira vez que o usuário faz login
      if (user) {
        token.role = user.role
        token.apiToken = user.token
        token.login = user.login
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Passa as informações do token para a sessão
      if (token) {
        session.user.id = token.userId as string
        session.user.role = token.role as string
        session.user.apiToken = token.apiToken as string
        session.user.login = token.login as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 360 * 360,
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
