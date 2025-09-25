import { toast } from "sonner"

import type { usuariosCadastrados } from "@/types/types"
import type {
  CreateUserFormData,
  CreateUserResponse,
} from "../usuario/registrar/page"

type ApiCallFunction = (url: string, options?: RequestInit) => Promise<unknown>

export class UserServices {
  async criarUsuario(
    apiCall: ApiCallFunction,
    { login, senha, email, role }: CreateUserFormData
  ): Promise<CreateUserResponse | null> {
    try {
      console.log("Criando usuário com login:", login, senha)
      const response = await apiCall(`/v1/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha, email, role }),
      })

      return response as CreateUserResponse
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("400")) {
          toast.error("Usuário já cadastrado!")
        } else if (error.message.includes("403")) {
          toast.error("Erro de validação. Verifique os dados e tente novamente")
        } else {
          toast.error("Erro inesperado ao criar usuário")
        }
      } else {
        toast.error("Erro desconhecido ao criar usuário")
      }
      return null
    }
  }

  async listarTodasOsUsuariosCadastradas(
    apiCall: ApiCallFunction
  ): Promise<usuariosCadastrados[]> {
    try {
      const response = await apiCall(`/v1/users`, {
        method: "GET",
      })

      if (!response) {
        return []
      }

      return response as usuariosCadastrados[]
    } catch (error) {
      console.error("Erro ao buscar lojas no serviço:", error)
      throw error
    }
  }
}
