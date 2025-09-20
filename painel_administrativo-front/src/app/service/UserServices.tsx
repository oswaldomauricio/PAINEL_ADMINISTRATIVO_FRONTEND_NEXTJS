import { toast } from "sonner"

import type {
  CreateUserFormData,
  CreateUserResponse,
} from "../usuario/registrar/page"

type ApiCallFunction = (url: string, options?: RequestInit) => Promise<unknown>

export class UserServices {
  async criarUsuario(
    apiCall: ApiCallFunction,
    { login, senha, email }: CreateUserFormData
  ): Promise<CreateUserResponse | null> {
    try {
      console.log("Criando usuário com login:", login, senha)
      const response = await apiCall(`/v1/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha, email }),
      })

      return response as CreateUserResponse
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("403")) {
          toast.error("Usuário já existe ou acesso negado")
        } else if (error.message.includes("400")) {
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
}
