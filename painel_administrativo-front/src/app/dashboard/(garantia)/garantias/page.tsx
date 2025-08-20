"use client"

import { useState } from "react"
import { toDate } from "date-fns"
import { Plus, Search, Wrench } from "lucide-react"

import type { garantiasType } from "../../types/types"

import { garantiasData } from "../../_data/garantiasData"

import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupText } from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import BasicTableGarantia from "../../../components/table_garantia"
import { NewRequestModalWarranty } from "@/app/components/new-request-modal-warranty"

export default function GarantiaPage() {
  const [search, setSearch] = useState("")
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false)
  const [tickets, setTickets] = useState(garantiasData)

  const handleNewRequest = (requestData: garantiasType) => {
    const newTicket = {
      id: `DV-${String(tickets.length + 1).padStart(3, "0")}`,
      store: requestData.store,
      requestDate: toDate(Date.now()),
      openDays: Math.abs(
        Math.floor(
          (new Date(requestData.requestDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      ),
      supplier: requestData.supplier,
      salesNote: requestData.salesNote,
      description: requestData.description,
      produtos: (requestData.produtos ?? []).map((item) => ({
        productCode: item.productCode,
        quantity: item.quantity,
        value: item.value,
      })),
      customerName: requestData.customerName,
      customerDocument: requestData.customerDocument,
      status: "NOVO" as const,
    }
    setTickets([...tickets, newTicket])
    setIsNewRequestOpen(false)
    console.log(newTicket, "NEW TICKET")
  }

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
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Loja:" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="101">101</SelectItem>
                  <SelectItem value="102">102</SelectItem>
                  <SelectItem value="103">103</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <Button variant={"default"} className="w-2/8 gap-4">
              <Search className="h-4 w-4" />
              Relatórios
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
          <BasicTableGarantia search={search} />
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
