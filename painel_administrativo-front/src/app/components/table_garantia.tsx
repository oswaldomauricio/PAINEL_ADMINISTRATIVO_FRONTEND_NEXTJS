"use client"

import { useRouter } from "next/navigation"

import { garantiasData } from "../dashboard/_data/garantiasData"

import { getStatusColor } from "@/lib/utils"

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
  search: string
}

export default function BasicTableGarantia({ search }: BasicTableProps) {
  const router = useRouter()
  const filteredData = garantiasData.filter(
    (item) =>
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.openDays.toString().includes(search.toLowerCase()) ||
      item.store.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ticket</TableHead>
              <TableHead className="text-center">Loja</TableHead>
              <TableHead className="text-center">Data de solicitação</TableHead>
              <TableHead className="text-center">Dias em aberto</TableHead>
              <TableHead className="text-center">Fornecedor</TableHead>
              <TableHead className="text-center">Nota de venda</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-left">Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground"
                >
                  Nenhum valor encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => router.push(`/garantias/${item.id}`)}
                >
                  <TableCell className="font-medium text-center">
                    {item.id}
                  </TableCell>
                  <TableCell className="text-center">{item.store}</TableCell>
                  <TableCell className="text-center">
                    {item.requestDate instanceof Date
                      ? item.requestDate.toLocaleDateString()
                      : item.requestDate}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.openDays > 10
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.openDays} days
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{item.supplier}</TableCell>
                  <TableCell className="text-center">
                    {item.salesNote}
                  </TableCell>
                  <TableCell
                    className={(getStatusColor(item.status), "text-center")}
                  >
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.description.slice(0, 50)}...</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
