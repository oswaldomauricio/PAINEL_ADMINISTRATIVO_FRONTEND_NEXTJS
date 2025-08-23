"use client"

import { useRouter } from "next/navigation"

import type { garantiasType } from "../dashboard/types/types"

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

interface BasicTableGarantiaProps {
  data: garantiasType[]
}

export default function BasicTableGarantia({ data }: BasicTableGarantiaProps) {
  const router = useRouter()

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ticket</TableHead>
              <TableHead className="text-center">Loja</TableHead>
              <TableHead className="text-center">Nome do cliente</TableHead>
              <TableHead className="text-center">Fornecedor</TableHead>
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
                  colSpan={8}
                  className="text-center text-muted-foreground"
                >
                  Nenhum valor encontrado
                </TableCell>
              </TableRow>
            ) : (
              data.map((item: garantiasType) => (
                <TableRow
                  key={item.id}
                  onClick={() => router.push(`/dashboard/garantias/${item.id}`)}
                >
                  <TableCell className="font-medium text-center">
                    {item.id}
                  </TableCell>
                  <TableCell className="text-center">{item.loja}</TableCell>
                  <TableCell className="text-center">
                    {item.nome_cliente.toUpperCase()}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.fornecedor.toUpperCase()}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatToDDMMYYYYHHMM(item.data_solicitacao)}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.nota_de_venda}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDiasEmAbertoColor(item.dias_em_aberto)}`}
                    >
                      {item.dias_em_aberto} dias
                    </span>
                  </TableCell>
                  <TableCell
                    className={
                      (getStatusColor(item.status.toString()), "text-center")
                    }
                  >
                    <Badge className={getStatusColor(item.status.toString())}>
                      {item.status.toString().toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
