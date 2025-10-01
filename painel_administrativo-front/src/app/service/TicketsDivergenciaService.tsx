import { toast } from "sonner"

import type {
  CriarDivergenciaDTO,
  TicketPageDivergencia,
  divergenciasType,
  estatisticasTickets,
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
  async listarTickets(
    apiCall: ApiCallFunction,
    params: {
      id_loja?: string | number | null
      ticketId?: string | number
      fornecedor?: string
      cpfCnpj?: string
      nota?: string
      dataInicio?: string
      dataFim?: string
      status?: string
      page: number
      size: number
    }
  ): Promise<TicketPageDivergencia> {
    if (!params.id_loja) {
      console.warn("ID da loja não fornecido para listar os tickets.")
      return { content: [], totalElements: 0, totalPages: 0 }
    }

    try {
      const query = new URLSearchParams()

      query.append("loja", String(params.id_loja))
      if (params.ticketId) query.append("ticketId", String(params.ticketId))
      if (params.fornecedor) query.append("fornecedor", params.fornecedor)
      if (params.cpfCnpj) query.append("cpfCnpj", params.cpfCnpj)
      if (params.nota) query.append("nota", params.nota)
      if (params.dataInicio) query.append("dataInicio", params.dataInicio)
      if (params.dataFim) query.append("dataFim", params.dataFim)
      if (params.status) query.append("status", params.status)

      query.append("page", String(params.page))
      query.append("size", String(params.size))
      query.append("sort", "id,desc")

      const url = `/v1/ticket-divergencia?${query.toString()}`

      const response = (await apiCall(url, {
        method: "GET",
      })) as TicketPageDivergencia

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
      const response = (await apiCall(
        `/v1/ticket-divergencia?ticketId=${id_ticket.toString()}`,
        { method: "GET" }
      )) as TicketPageDivergencia

      if (response.content && response.content.length > 0) {
        return response.content[0] as divergenciasType
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

  async listarEstatisticasDoTicket(
    apiCall: ApiCallFunction,
    loja: number | string
  ): Promise<estatisticasTickets | null> {
    if (!loja) {
      console.warn("loja não enviada, verifique!")
      return null
    }

    try {
      const response = (await apiCall(
        `/v1/ticket-divergencia/estatisticas/${loja}`,
        { method: "GET" }
      )) as estatisticasTickets

      if (response) {
        return response as estatisticasTickets
      }

      return null
    } catch (error) {
      console.error("Erro ao buscar estatisticas do ticket:", error)
      throw error
    }
  }
}
