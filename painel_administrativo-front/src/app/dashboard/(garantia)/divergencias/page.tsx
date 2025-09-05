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
} from "../../types/types"

import { hasPermission } from "@/lib/permissions"

import { useApi } from "@/hooks/use-api"
import { useStore } from "@/contexts/lojaContext"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupText } from "@/components/ui/input-group"
import BasicTableDivergencia from "../../../components/table_divergencia"
import { NewRequestModalDivergence } from "@/app/components/new-request-modal-divergence"
import SelectLojas from "@/app/components/ui/select-lojas"

const ticketDivergenciaService = new TicketDivergencia()

export default function DivergenciaPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false)
  const { store } = useStore()
  const { apiCall, token, user } = useApi()

  const [page, setPage] = useState(0)
  const [size] = useState(20)
  const [ticketPage, setTicketPage] = useState<TicketPageDivergencia>({
    content: [],
    totalElements: 0,
    totalPages: 0,
  })

  const [loading, setLoading] = useState(false)

  const handleFetchTickets = useCallback(async () => {
    if (!token || !store) return
    setLoading(true)
    try {
      const result = await ticketDivergenciaService.listarTicketsPorLoja(
        apiCall,
        store,
        page,
        size
      )
      setTicketPage(result)
    } catch (error) {
      console.error("Erro ao buscar tickets:", error)
    } finally {
      setLoading(false)
    }
  }, [token, store, apiCall, page, size])

  useEffect(() => {
    handleFetchTickets()
  }, [handleFetchTickets])

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

  const filteredData = Array.isArray(ticketPage.content)
    ? ticketPage.content.filter(
        (item) =>
          item.id.toString().includes(search.toLowerCase()) ||
          item.dias_em_aberto.toString().includes(search.toLowerCase()) ||
          item.loja.toString().includes(search.toLowerCase()) ||
          item.fornecedor.toLowerCase().includes(search.toLowerCase()) ||
          item.descricao.toLowerCase().includes(search.toLowerCase())
      )
    : []

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

        <div className="col-span-2 row-start-2 py-2">
          <div className="flex flex-row items-center gap-4">
            <CardContent className="w-2/6">
              <SelectLojas title="" />
            </CardContent>
            <Button
              variant={"default"}
              className="w-2/8 gap-4"
              onClick={handleFetchTickets}
              disabled={loading}
            >
              <Search className="h-4 w-4" />
              {loading ? "Carregando..." : "Relatórios"}
            </Button>
          </div>
        </div>

        <div className="col-span-3 row-start-3">
          <InputGroup className="w-full">
            <InputGroupText aria-hidden>
              <Search className="h-4 w-4" />
            </InputGroupText>
            <Input
              type="search"
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>

        <div className="col-span-3 row-start-4 items-center">
          <BasicTableDivergencia data={filteredData} />
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
