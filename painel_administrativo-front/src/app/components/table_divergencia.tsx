"use client"

import { useRouter } from "next/navigation"

import type { divergenciasType } from "../dashboard/types/types"

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

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
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
                  colSpan={8}
                  className="text-center text-muted-foreground"
                >
                  Nenhum valor encontrado
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() =>
                    router.push(`/dashboard/divergencias/${item.id}`)
                  }
                >
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
                  <TableCell className="text-center">{item.cpfCnpj}</TableCell>
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
