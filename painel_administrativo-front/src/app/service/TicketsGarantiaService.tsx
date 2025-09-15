import type {
  CriarGarantiaDTO,
  TicketPage,
  garantiasType,
} from "../../types/types"

type ApiCallFunction = (url: string, options: RequestInit) => Promise<unknown>

export class TicketGarantia {
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
  ): Promise<TicketPage> {
    if (!id_loja) {
      console.warn("ID da loja não fornecido para listar os tickets.")
      return { content: [], totalElements: 0, totalPages: 0 }
    }

    try {
      const url = `/v1/ticket-garantia/loja/${id_loja}?page=${page}&size=${size}&sort=id,desc`
      const response = (await apiCall(url, {
        method: "GET",
      })) as TicketPage

      return response || { content: [], totalElements: 0, totalPages: 0 }
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
