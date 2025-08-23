import { useCallback } from "react"
import { useSession } from "next-auth/react"

export interface errors {
  message: string
  name: string
}

export function useApi() {
  const { data: session } = useSession()

  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      if (!session?.user?.apiToken) {
        throw new Error("Token de autenticação não encontrado")
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const url = `${baseUrl}${endpoint}`

      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            Authorization: `Bearer ${session.user.apiToken}`,
            ...options.headers,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Token expirado ou inválido")
          }
          if (response.status === 403) {
            throw new Error("Acesso negado")
          }
          throw new Error(`Erro na API: ${response.status}`)
        }

        return response.json()
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name === "TypeError" && err.message === "Failed to fetch") {
            console.error("❌ Falha ao conectar à API:", url)
            console.error(
              "Possíveis causas:\n" +
                "- Backend está offline ou porta errada\n" +
                "- Mixed content (frontend HTTPS x backend HTTP)\n" +
                "- Host localhost inacessível (SSR ou Docker)\n"
            )
          } else {
            console.error("❌ Erro inesperado:", err)
          }
          throw err
        }
      }
    },
    [session?.user?.apiToken]
  )
  return { apiCall, token: session?.user?.apiToken, user: session?.user }
}
