"use client"

import { useState } from "react"
import Link from "next/link"
import { Package, Search, SendHorizontal } from "lucide-react"

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
import BasicTable from "../../../components/table"

export default function GarantiaPage() {
  const [search, setSearch] = useState("")

  return (
    <div className="container py-4">
      <div className="grid grid-cols-3 grid-rows-[auto_auto_auto_1fr] gap-y-2">
        <div className="col-span-2 row-start-1 py-2">
          <h1 className="text-3xl font-bold flex items-center gap-4">
            <Package className="h-8 w-8 text-red-500" />
            <span>Garantias</span>
          </h1>
          <div className="flex flex-row items-start gap-8">
            <p className="text-lg font-semibold py-1">
              Relatório de solicitações de garantias
            </p>
            <Button variant="default" className="w-2/8 gap-4">
              <Link
                href="/garantias/novo"
                className="gap-2 flex items-center flex-row"
              >
                <SendHorizontal className="h-4 w-4" />
                Nova solicitação
              </Link>
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
          <BasicTable search={search} />
        </div>
      </div>
    </div>
  )
}
