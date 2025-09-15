import { toast } from "sonner"

import type {
  CriarDivergenciaDTO,
  TicketPageDivergencia,
  divergenciasType,
} from "../../types/types"

type ApiCallFunction = (url: string, options: RequestInit) => Promise<unknown>

export class TicketDivergencia {
  /**
   *
   * @param apiCall
   * @param id_loja
   * @param id_ticket
   * @param page
   * @param size
   * @returns
   */
  async listarTicketsPorLoja(
    apiCall: ApiCallFunction,
    id_loja: string | number | null,
    page: number,
    size: number
  ): Promise<TicketPageDivergencia> {
    if (!id_loja) {
      console.warn("ID da loja não fornecido para listar os tickets.")
      return { content: [], totalElements: 0, totalPages: 0 }
    }

    try {
      const response = (await apiCall(
        `/v1/ticket-divergencia/loja/${id_loja}?page=${page}&size=${size}&sort=id,desc`,
        { method: "GET" }
      )) as TicketPageDivergencia

      return response || { content: [], totalElements: 0, totalPages: 0 }
    } catch (error) {
      console.error("Erro ao buscar tickets por loja no serviço:", error)
      toast.error("Erro ao buscar tickets por loja.")
      throw error
    }
  }

  async listarTicketsPorId(
    apiCall: ApiCallFunction,
    id_ticket: string | number | null
  ): Promise<divergenciasType | null> {
    if (!id_ticket) {
      console.warn("Ticket não encontrado!")
      return null
    }

    try {
      const response = await apiCall(`/v1/ticket-divergencia/${id_ticket}`, {
        method: "GET",
      })

      if (response) {
        return response as divergenciasType
      }

      return null
    } catch (error) {
      console.error("Erro ao buscar o ticket por id no serviço:", error)
      throw error
    }
  }

  async criarTicket(
    apiCall: ApiCallFunction,
    data: CriarDivergenciaDTO
  ): Promise<divergenciasType | null> {
    try {
      const response = await apiCall(`/v1/ticket-divergencia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response) {
        return response as divergenciasType
      }

      return null
    } catch (error) {
      console.error("Erro ao criar ticket, verifique!:", error)
      throw error
    }
  }
}
