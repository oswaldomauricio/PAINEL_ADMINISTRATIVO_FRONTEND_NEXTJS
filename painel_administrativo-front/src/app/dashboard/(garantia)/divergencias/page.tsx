"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TicketDivergencia } from "@/app/service/TicketsDivergenciaService"
import { toast } from "sonner"
import { Package, Plus, Search } from "lucide-react"

import type { Roles } from "@/types/roles"
import type {
  CriarDivergenciaDTO,
  TicketPageDivergencia,
  estatisticasTickets,
} from "../../../../types/types"
import { StatusTicketDivergencia } from "../../../../types/types"

import { hasPermission } from "@/lib/permissions"
import { firstLetterUpperCase } from "@/lib/utils"

import { useApi } from "@/hooks/use-api"
import { useStore } from "@/contexts/lojaContext"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import CardsEstatisticas from "@/components/ui/cards-estatisticas"
import { Input } from "@/components/ui/input"
import BasicTableDivergencia from "../../../components/table_divergencia"
import { NewRequestModalDivergence } from "@/app/components/new-request-modal-divergence"
import SelectLojas from "@/app/components/ui/select-lojas"

const ticketDivergenciaService = new TicketDivergencia()

export default function DivergenciaPage() {
  const router = useRouter()

  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false)
  const { store } = useStore()
  const { apiCall, token, user } = useApi()

  const [page, setPage] = useState(0)
  const [size] = useState(50)
  const [ticketPage, setTicketPage] = useState<TicketPageDivergencia>({
    content: [],
    totalElements: 0,
    totalPages: 0,
  })
  const status = Object.values(StatusTicketDivergencia).filter(
    (value) => typeof value === "string"
  )

  const [loading, setLoading] = useState(false)

  const [filters, setFilters] = useState({
    ticketId: "",
    fornecedor: "",
    nomeCliente: "",
    cpfCnpj: "",
    nota: "",
    dataInicio: "",
    dataFim: "",
    status: "",
  })

  const [stats, setStats] = useState<estatisticasTickets>({
    totalTickets: 0,
    ticketsAbertos: 0,
    ticketsEmAndamento: 0,
    ticketsConcluidos: 0,
    ticketsCancelados: 0,
  })

  const handleFetchTickets = useCallback(async () => {
    if (!token || !store) return
    setLoading(true)
    try {
      const result = await ticketDivergenciaService.listarTickets(apiCall, {
        id_loja: store,
        ...filters,
        page,
        size,
      })
      setTicketPage(result)
    } catch (error) {
      console.error("Erro ao buscar tickets:", error)
    } finally {
      setLoading(false)
    }
  }, [token, store, apiCall, page, size, filters])

  const handleFetchStats = useCallback(async () => {
    if (!token || !store) return
    try {
      const resumo = await ticketDivergenciaService.listarEstatisticasDoTicket(
        apiCall,
        store
      )
      setStats(resumo as estatisticasTickets)
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
    }
  }, [token, store, apiCall])

  const handleButtonClick = () => {
    handleFetchTickets()
    handleFetchStats()
  }

  const handleNewRequest = async (requestData: CriarDivergenciaDTO) => {
    try {
      const novoTicket = await ticketDivergenciaService.criarTicket(
        apiCall,
        requestData
      )
      if (novoTicket) {
        setTicketPage((prev) => ({
          ...prev,
          content: [novoTicket, ...prev.content],
        }))
        setIsNewRequestOpen(false)
        router.push(`/dashboard/divergencias/${novoTicket.id}`)
      }
    } catch (error) {
      toast.error("Erro ao criar ticket:")
      console.error("Erro ao criar ticket:", error)
    }
  }

  // Carregar dados ao montar a página
  useEffect(() => {
    handleFetchTickets()
    handleFetchStats()
  }, [handleFetchTickets, handleFetchStats])

  return (
    <div className="container py-4">
      <div className="grid grid-cols-3 grid-rows-[auto_auto_auto_1fr] gap-y-2">
        <div className="col-span-3 row-start-1 py-2">
          <h1 className="text-3xl font-bold flex items-center gap-4">
            <Package className="h-8 w-8 text-red-500" />
            <span>Divergências</span>
          </h1>
          <div className="flex flex-row items-start justify-between w-full">
            <p className="text-lg font-semibold py-1">
              Relatório de solicitações de Divergências
            </p>
            {user?.role &&
              hasPermission(user.role as Roles, "create:ticket") && (
                <Button
                  onClick={() => setIsNewRequestOpen(true)}
                  className="flex items-center gap-2 flex-row"
                >
                  <Plus className="h-4 w-4" />
                  Nova solicitação
                </Button>
              )}
          </div>
        </div>

        <div className="col-span-3 row-start-2 py-2">
          <CardsEstatisticas
            totalTickets={stats.totalTickets}
            ticketsAbertos={stats.ticketsAbertos}
            ticketsEmAndamento={stats.ticketsEmAndamento}
            ticketsConcluidos={stats.ticketsConcluidos}
            ticketsCancelados={stats.ticketsCancelados}
          />

          {/* --- Filtros dinâmicos --- */}
          <div className="grid grid-cols-4 gap-4 rounded-t-2xl ">
            <Input
              placeholder="Número do Ticket"
              value={filters.ticketId}
              onChange={(e) =>
                setFilters({ ...filters, ticketId: e.target.value })
              }
            />
            <Input
              placeholder="Fornecedor"
              value={filters.fornecedor}
              onChange={(e) =>
                setFilters({ ...filters, fornecedor: e.target.value })
              }
            />
            <Input
              placeholder="CPF/CNPJ"
              value={filters.cpfCnpj}
              onChange={(e) =>
                setFilters({ ...filters, cpfCnpj: e.target.value })
              }
            />
            <Input
              placeholder="Número da Nota"
              value={filters.nota}
              onChange={(e) => setFilters({ ...filters, nota: e.target.value })}
            />
            <Input
              type="date"
              value={filters.dataInicio}
              onChange={(e) =>
                setFilters({ ...filters, dataInicio: e.target.value })
              }
            />
            <Input
              type="date"
              value={filters.dataFim}
              onChange={(e) =>
                setFilters({ ...filters, dataFim: e.target.value })
              }
            />
            <select
              className="border rounded p-2"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">Todos</option>
              {status.map((status) => (
                <option key={status} value={status.toString()}>
                  {firstLetterUpperCase(
                    status.replaceAll("_", " ").toLowerCase()
                  )}
                </option>
              ))}
            </select>
          </div>

          {/* Lojas + botão embaixo ocupando linha inteira */}
          <div className="flex items-center gap-4 rounded-b-2xl py-4">
            <CardContent className="w-1/3">
              <SelectLojas title="" />
            </CardContent>
            <Button
              variant="default"
              className="gap-4"
              onClick={handleButtonClick}
              disabled={loading}
            >
              <Search className="h-4 w-4" />
              {loading ? "Carregando..." : "Relatórios"}
            </Button>
          </div>
        </div>

        <div className="col-span-3 row-start-4 items-center">
          <BasicTableDivergencia data={ticketPage.content} />
        </div>
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          Anterior
        </Button>
        <span>
          Página {page + 1} de {ticketPage.totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page + 1 >= ticketPage.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Próxima
        </Button>
      </div>

      <NewRequestModalDivergence
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        onSubmit={handleNewRequest}
      />
    </div>
  )
}
