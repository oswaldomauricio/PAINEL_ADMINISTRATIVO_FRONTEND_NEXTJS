"use client"

import { useRouter } from "next/navigation"

import type { divergenciasType } from "../(modulos)/types/types"

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
  data: divergenciasType[]
}

export default function BasicTableDivergencia({
  search,
  data,
}: BasicTableProps) {
  const router = useRouter()
  const filteredData = data.filter(
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
              <TableHead className="text-center">Ticket</TableHead>
              <TableHead className="text-center">Loja</TableHead>
              <TableHead className="text-center">Data de solicitação</TableHead>
              <TableHead className="text-center">Dias em aberto</TableHead>
              <TableHead className="text-center">Fornecedor</TableHead>
              <TableHead className="text-center">CNPJ</TableHead>
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
                  onClick={() => router.push(`/divergencias/${item.id}`)}
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
                  <TableCell className="text-center">{item.openDays}</TableCell>
                  <TableCell className="text-center">{item.supplier}</TableCell>
                  <TableCell className="text-center">
                    {item.supplierDocument}
                  </TableCell>
                  <TableCell className="text-center">{item.status}</TableCell>
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
