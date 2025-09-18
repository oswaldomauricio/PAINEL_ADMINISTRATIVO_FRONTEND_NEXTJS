"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckSquare, Square } from "lucide-react"

import type { divergenciasType } from "../../types/types"

import {
  formatToDDMMYYYYHHMM,
  getDiasEmAbertoColor,
  getStatusColor,
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

type BasicTableProps = {
  data: divergenciasType[]
}

export default function BasicTableDivergencia({ data }: BasicTableProps) {
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
              <TableHead className="text-center">Ticket</TableHead>
              <TableHead className="text-center">Loja</TableHead>
              <TableHead className="text-center">Fornecedor</TableHead>
              <TableHead className="text-center">Data de solicitação</TableHead>
              <TableHead className="text-center">Nota de entrada</TableHead>
              <TableHead className="text-center">CNPJ</TableHead>
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
              data.map((item: divergenciasType) => {
                const isSelected = selectedRows.includes(item.id)

                return (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      router.push(`/dashboard/divergencias/${item.id}`)
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

                    <TableCell className="font-medium text-center">
                      {item.id}
                    </TableCell>
                    <TableCell className="text-center">{item.loja}</TableCell>
                    <TableCell className="text-center">
                      {item.fornecedor.toUpperCase()}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatToDDMMYYYYHHMM(item.data_solicitacao)}
                    </TableCell>
                    <TableCell className="text-center">{item.nota}</TableCell>
                    <TableCell className="text-center">
                      {item.cpfCnpj}
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
