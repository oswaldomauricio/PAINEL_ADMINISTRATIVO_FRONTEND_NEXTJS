"use client"

import { useState } from "react"
import { TicketGarantia } from "@/app/service/TicketsGarantiaService"
import { Plus, Search, Wrench } from "lucide-react"

import type { CriarGarantiaDTO, garantiasType } from "../../types/types"

import { useApi } from "@/hooks/use-api"
import { useStore } from "@/contexts/lojaContext"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupText } from "@/components/ui/input-group"
import BasicTableGarantia from "../../../components/table_garantia"
import { NewRequestModalWarranty } from "@/app/components/new-request-modal-warranty"
import SelectLojas from "@/app/components/ui/select-lojas"

const ticketGarantiaService = new TicketGarantia()

export default function GarantiaPage() {
  const [search, setSearch] = useState("")
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false)
  const { store } = useStore()
  const { apiCall, token } = useApi()

  const [tickets, setTickets] = useState<garantiasType[]>([])
  const [loading, setLoading] = useState(false)

  const handleFetchTickets = async () => {
    if (!token) return
    setLoading(true)
    try {
      const result = await ticketGarantiaService.listarTicketsPorLoja(
        apiCall,
        store
      )
      setTickets(result)
    } catch (error) {
      console.error("Erro ao buscar tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewRequest = async (requestData: CriarGarantiaDTO) => {
    try {
      const novoTicket = await ticketGarantiaService.criarTicket(
        apiCall,
        requestData
      )
      if (novoTicket) {
        setTickets((prev) => [...prev, novoTicket])
        setIsNewRequestOpen(false)
      }
    } catch (error) {
      console.error("Erro ao criar ticket:", error)
    }
  }

  const filteredData = tickets.filter(
    (item) =>
      item.id.toString().includes(search.toLowerCase()) ||
      item.dias_em_aberto.toString().includes(search.toLowerCase()) ||
      item.loja.toString().includes(search.toLowerCase()) ||
      item.fornecedor.toLowerCase().includes(search.toLowerCase()) ||
      item.nome_cliente.toLowerCase().includes(search.toLowerCase()) ||
      item.descricao.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container py-4">
      <div className="grid grid-cols-3 grid-rows-[auto_auto_auto_1fr] gap-y-2">
        <div className="col-span-3 row-start-1 py-2">
          <h1 className="text-3xl font-bold flex items-center gap-4">
            <Wrench className="h-8 w-8 text-red-500" />
            <span>Garantias</span>
          </h1>
          <div className="flex flex-row items-start justify-between w-full">
            <p className="text-lg font-semibold py-1">
              Relatório de solicitações de Garantias
            </p>
            <Button
              onClick={() => setIsNewRequestOpen(true)}
              className="flex items-center gap-2 flex-row"
            >
              <Plus className="h-4 w-4" />
              Nova solicitação
            </Button>
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
          <BasicTableGarantia data={filteredData} />
        </div>
      </div>

      <NewRequestModalWarranty
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        onSubmit={handleNewRequest}
      />
    </div>
  )
}
