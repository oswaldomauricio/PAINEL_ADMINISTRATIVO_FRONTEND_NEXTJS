import { toast } from "sonner"

import type {
  StatusTicketDivergencia,
  StatusTicketGarantia,
} from "../dashboard/types/types"

type ApiCallFunction = <T>(url: string, options: RequestInit) => Promise<T>

export interface StatusHandler {
  ticketId: number
  statusNovo: StatusTicketGarantia | StatusTicketDivergencia
  alteradoPor: string
  mensagem: string
  dataAtualizacao: string
}

export interface CreateNewStatus {
  ticketId: number
  status: StatusTicketGarantia | StatusTicketDivergencia
  mensagem: string
  idUser: number | string | undefined
}

export class TicketStatusService {
  /**
   * Posta uma nova atualização de status e mensagem para um ticket.
   * @param apiCall - Função que executa a chamada à API.
   * @param data - Os dados para a atualização do status do ticket.
   * @returns Uma promessa que resolve para os detalhes da alteração de status.
   */

  async atualizarStatusGarantia(
    apiCall: ApiCallFunction,
    data: CreateNewStatus
  ): Promise<StatusHandler | null> {
    try {
      const url = `/v1/ticket-garantia/status/atualizar`

      const response = await apiCall<StatusHandler>(url, {
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

  async atualizarStatusDivergencia(
    apiCall: ApiCallFunction,
    data: CreateNewStatus
  ): Promise<StatusHandler | null> {
    try {
      const url = `/v1/ticket-divergencia/status/atualizar`

      const response = await apiCall<StatusHandler>(url, {
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

  async listarStatusGarantia(
    apiCall: ApiCallFunction,
    ticketId: number
  ): Promise<StatusHandler | null> {
    if (!ticketId) {
      console.warn("Ticket não encontrado!")
      return null
    }

    try {
      const url = `/v1/ticket-garantia/status/historico?ticketId=${ticketId}`

      const response = await apiCall<StatusHandler>(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (response) {
        return response as StatusHandler
      }

      return null
    } catch (error) {
      console.error("Erro ao atualizar o status do ticket: ", error)
      toast.error("Erro ao atualizar o status do ticket")
      throw error
    }
  }

  async listarStatusDivergencia(
    apiCall: ApiCallFunction,
    ticketId: number
  ): Promise<StatusHandler | null> {
    if (!ticketId) {
      console.warn("Ticket não encontrado!")
      return null
    }

    try {
      const url = `/v1/ticket-divergencia/status/historico?ticketId=${ticketId}`

      const response = await apiCall<StatusHandler>(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (response) {
        return response as StatusHandler
      }

      return null
    } catch (error) {
      console.error("Erro ao atualizar o status do ticket: ", error)
      toast.error("Erro ao atualizar o status do ticket")
      throw error
    }
  }
}
