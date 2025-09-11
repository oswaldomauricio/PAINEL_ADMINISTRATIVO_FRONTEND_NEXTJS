import { toast } from "sonner"

type ApiCallFunction = <T>(url: string, options: RequestInit) => Promise<T>

interface Usuario {
  id: number
  login: string
  role: string
}

export interface Mensagem {
  id: number
  ticketId: number
  usuario: Usuario
  msg: string
  internal: boolean
  timestamp: string
}

export interface CreateMensagem {
  ticketId: number
  id_usuario: number | string | undefined
  msg: string
  internal: boolean
}

export class TicketMessageService {
  /**
   * Busca e retorna as mensagens de um ticket.
   * @param apiCall - Função que executa a chamada à API.
   * @param id_ticket - O ID do ticket.
   * @param tipo_ticket - Tipo do ticket: 'GARANTIA' ou 'DIVERGENCIA'.
   * @returns Uma promessa que resolve para um array de mensagens.
   */
  async listarMensagens(
    apiCall: ApiCallFunction,
    id_ticket: string | number,
    tipo_ticket: string
  ): Promise<Mensagem[]> {
    if (!id_ticket) {
      toast.error("ID do ticket não existe, ou não encontrado.")
      return []
    }

    try {
      let url = ""

      if (tipo_ticket === "GARANTIA") {
        url = `/v1/ticket-garantia/mensagem/${id_ticket}`
      } else if (tipo_ticket === "DIVERGENCIA") {
        url = `/v1/ticket-divergencia/mensagem/${id_ticket}`
      } else {
        toast.error("Tipo de ticket inválido:")
        return []
      }

      const response = await apiCall<Mensagem[]>(url, { method: "GET" })

      return Array.isArray(response) ? response : []
    } catch (error) {
      console.error("Erro ao buscar mensagens no serviço:", error)
      throw error
    }
  }

  async criarNovaMensagem(
    apiCall: ApiCallFunction,
    data: CreateMensagem,
    tipo_ticket: string
  ): Promise<Mensagem | null> {
    try {
      let url = ""

      if (tipo_ticket === "GARANTIA") {
        url = `/v1/ticket-garantia/mensagem`
      } else if (tipo_ticket === "DIVERGENCIA") {
        url = `/v1/ticket-divergencia/mensagem`
      } else {
        toast.error("Tipo de ticket inválido:")
        return null
      }

      const response = await apiCall<Mensagem>(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      return response ?? null
    } catch (error) {
      console.error("Erro ao criar mensagem de ticket:", error)
      toast.error("Erro ao criar mensagem de ticket")
      throw error
    }
  }
}
