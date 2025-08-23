import type { CriarGarantiaDTO, garantiasType } from "../dashboard/types/types"

type ApiCallFunction = (url: string, options: RequestInit) => Promise<unknown>

interface TicketPage {
  content: garantiasType[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export class TicketGarantia {
  /**
   *
   * @param apiCall
   * @param id_loja
   * @param id_ticket
   * @returns
   */
  async listarTicketsPorLoja(
    apiCall: ApiCallFunction,
    id_loja: string | number | null
  ): Promise<garantiasType[]> {
    if (!id_loja) {
      console.warn("loja não fornecido para listar os tickets.")
      return []
    }

    try {
      const response = (await apiCall(
        `/v1/ticket-garantia/loja/${id_loja}?page=0&size=20&sort=id,asc`,
        { method: "GET" }
      )) as TicketPage

      if (response && Array.isArray(response.content)) {
        return response.content
      }

      return []
    } catch (error) {
      console.error("Erro ao buscar tickets por loja no serviço:", error)
      throw error
    }
  }

  async listarTicketsPorId(
    apiCall: ApiCallFunction,
    id_ticket: string | number | null
  ): Promise<garantiasType | null> {
    if (!id_ticket) {
      console.warn("Ticket não encontrado!")
      return null
    }

    try {
      const response = await apiCall(`/v1/ticket-garantia/${id_ticket}`, {
        method: "GET",
      })

      if (response) {
        return response as garantiasType
      }

      return null
    } catch (error) {
      console.error("Erro ao buscar o ticket por id no serviço:", error)
      throw error
    }
  }

  async criarTicket(
    apiCall: ApiCallFunction,
    data: CriarGarantiaDTO
  ): Promise<garantiasType | null> {
    try {
      const response = await apiCall(`/v1/ticket-garantia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response) {
        return response as garantiasType
      }

      return null
    } catch (error) {
      console.error("Erro ao criar ticket, verifique!:", error)
      throw error
    }
  }
}
