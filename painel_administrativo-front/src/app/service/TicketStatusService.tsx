import { toast } from "sonner"

import type { StatusTicket } from "../dashboard/types/types"

type ApiCallFunction = <T>(url: string, options: RequestInit) => Promise<T>

export interface StatusChange {
  ticketId: number
  ticketTipo: "GARANTIA" | "DIVERGENCIA"
  statusNovo: StatusTicket
  alteradoPor: string
  mensagem: string
  dataAtualizacao: string
}

export interface CreateMensagem {
  ticketId: number
  status: StatusTicket
  idUser: number | string | undefined
  mensagem: string
  ticketTipo: "GARANTIA" | "DIVERGENCIA"
}

export class TicketStatusService {
  /**
   * Posta uma nova atualização de status e mensagem para um ticket.
   * @param apiCall - Função que executa a chamada à API.
   * @param data - Os dados para a atualização do status do ticket.
   * @returns Uma promessa que resolve para os detalhes da alteração de status.
   */

  async atualizarStatus(
    apiCall: ApiCallFunction,
    data: CreateMensagem
  ): Promise<StatusChange | null> {
    try {
      const url = "/v1/ticket/status/atualizar"

      const response = await apiCall<StatusChange>(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      return response ?? null
    } catch (error) {
      console.error("Erro ao atualizar o ticket:", error)
      toast.error("Erro ao atualizar o ticket")
      throw error
    }
  }
}
