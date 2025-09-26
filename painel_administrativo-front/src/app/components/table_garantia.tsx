"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckSquare, Square } from "lucide-react"

import type { garantiasType } from "../../types/types"

import {
  formatToDDMMYYYYHHMM,
  getDiasEmAbertoColor,
  getStatusColor,
  truncateName,
} from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface BasicTableGarantiaProps {
  data: garantiasType[]
}

export default function BasicTableGarantia({ data }: BasicTableGarantiaProps) {
  const router = useRouter()
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[100px]">Ticket</TableHead>
              <TableHead className="text-center">Loja</TableHead>
              <TableHead className="text-center">Fornecedor</TableHead>
              <TableHead className="text-center">Nome do cliente</TableHead>
              <TableHead className="text-center">CPF / CNPJ</TableHead>
              <TableHead className="text-center">Data de solicitação</TableHead>
              <TableHead className="text-center">Nota de venda</TableHead>
              <TableHead className="text-center">Dias em aberto</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-muted-foreground"
                >
                  Nenhum valor encontrado
                </TableCell>
              </TableRow>
            ) : (
              data.map((item: garantiasType) => {
                const isSelected = selectedRows.includes(item.id)
                return (
                  <TableRow
                    key={item.id}
                    className={isSelected ? "bg-blue-50" : ""}
                    onClick={() =>
                      router.push(`/dashboard/garantias/${item.id}`)
                    }
                  >
                    {/* Botão de seleção */}
                    <TableCell
                      className="text-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleRow(item.id)
                      }}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </TableCell>

                    <TableCell className="font-medium text-center cursor-pointer">
                      {item.id}
                    </TableCell>
                    <TableCell className="text-center">{item.loja}</TableCell>
                    <TableCell className="text-center">
                      {item.fornecedor.toUpperCase()}
                    </TableCell>
                    <TableCell className="text-center">
                      {truncateName(item.nome_cliente.toUpperCase(), 50)}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.cpfCnpj}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatToDDMMYYYYHHMM(item.data_solicitacao)}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.nota_de_venda}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDiasEmAbertoColor(
                          item.dias_em_aberto
                        )}`}
                      >
                        {item.dias_em_aberto} dias
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getStatusColor(item.status.toString())}>
                        {item.status
                          .toString()
                          .toUpperCase()
                          .replaceAll("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
