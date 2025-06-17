"use client"

import { useRouter } from "next/navigation"

import { divergenciasData } from "../(modulos)/_data/divergenciasData"

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

export default function BasicTableDivergencia({ search }: BasicTableProps) {
  const router = useRouter()
  const filteredData = divergenciasData.filter(
    (item) =>
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.days_remaining.toString().includes(search.toLowerCase()) ||
      item.store.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      (item.sales_invoice &&
        item.sales_invoice.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ticket</TableHead>
              <TableHead className="text-left">Loja</TableHead>
              <TableHead className="text-left">Data</TableHead>
              <TableHead className="text-left">Dias em aberto</TableHead>
              <TableHead className="text-left">Fornecedor</TableHead>
              <TableHead className="text-left">Nota de venda</TableHead>
              <TableHead className="text-left">Status</TableHead>
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
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.store}</TableCell>
                  <TableCell>
                    {item.date instanceof Date
                      ? item.date.toLocaleDateString()
                      : item.date}
                  </TableCell>
                  <TableCell>{item.days_remaining}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{item.sales_invoice}</TableCell>
                  <TableCell className="text-left">{item.status}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
