import { toast } from "sonner"

import type { LojasCadastradas } from "@/types/types"

type ApiCallFunction = (url: string, options: RequestInit) => Promise<unknown>

interface AtribuirUsuarioLojaDTO {
  idUser: number
  loja: number
}

interface ListarUsuario {
  idUser: number
  loja: number
}

export class LojasService {
  /**
   * Busca e retorna a lista de lojas de um usuário.
   * @param apiCall - A função que executa a chamada à API.
   * @param id_usuario - O ID do usuário para buscar as lojas.
   * @returns Uma promessa que resolve para um array de números de loja.
   */
  async listarLojas(
    apiCall: ApiCallFunction, // Recebe a função como primeiro argumento
    id_usuario: string | number
  ): Promise<number[]> {
    if (!id_usuario) {
      console.warn("ID do usuário não fornecido para listarLojas.")
      return []
    }

    try {
      const response = await apiCall(`/v1/lojas/${id_usuario}`, {
        method: "GET",
      })

      if (response && Array.isArray(response)) {
        return response.map((item) => item.loja)
      }

      return []
    } catch (error) {
      console.error("Erro ao buscar lojas no serviço:", error)
      throw error
    }
  }

  async listarTodasAsLojasCadastradas(
    apiCall: ApiCallFunction
  ): Promise<LojasCadastradas[]> {
    try {
      const response = await apiCall(`/v1/lojas`, {
        method: "GET",
      })

      if (!response) {
        return []
      }

      return response as LojasCadastradas[]
    } catch (error) {
      console.error("Erro ao buscar lojas no serviço:", error)
      throw error
    }
  }

  async atribuirLojaParaUsuario(
    apiCall: ApiCallFunction,
    { idUser, loja }: AtribuirUsuarioLojaDTO
  ): Promise<ListarUsuario> {
    try {
      const response = await apiCall(`/v1/lojas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUser, loja }),
      })

      if (!response) {
        throw new Error("Não foi possível cadastrar a loja para o usuário!")
      }

      console.log(response, "response")

      return response as ListarUsuario
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.status === 400 && error?.response?.data) {
        toast.error(error.response.data)
      } else {
        console.error("Erro ao atribuir usuário à loja!")
      }

      console.error("Erro ao atribuir usuário à loja:", error)
      throw error
    }
  }
}
