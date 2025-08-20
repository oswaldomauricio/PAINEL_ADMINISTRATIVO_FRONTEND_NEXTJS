"use client"

import { useCallback } from "react"
import { useSession } from "next-auth/react"

export function useApi() {
  const { data: session } = useSession()

  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      if (!session?.user?.apiToken) {
        throw new Error("Token de autenticação não encontrado")
      }

      const url = `http://localhost:8080${endpoint}`

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
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
    },
    [session?.user?.apiToken]
  )

  return { apiCall, token: session?.user?.apiToken, user: session?.user }
}
