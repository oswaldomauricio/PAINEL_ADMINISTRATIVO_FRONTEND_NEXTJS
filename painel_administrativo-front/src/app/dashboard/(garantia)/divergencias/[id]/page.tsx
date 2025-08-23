"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  Clock,
  FileText,
  Package,
  Store,
  // User,
} from "lucide-react"

import type { FileDownloadProps } from "@/app/components/file-download"
import type {
  ProductDivergence,
  divergenciasType,
} from "@/app/dashboard/types/types"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ConversationHistory } from "@/app/components/conversation-history"
import { FileDownload } from "@/app/components/file-download"
import { RichTextEditor } from "@/app/components/rich-text-editor"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"

// Mock user role - in real app this would come from auth context
const currentUserRole = "ADMIN_GUARANTEE" // or "USER"

export default function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const ticketId = id
  const router = useRouter()

  const [ticket, setTicket] = useState<divergenciasType>()
  const [arquivos, setArquivos] = useState<FileDownloadProps>()
  const [newStatus, setNewStatus] = useState(ticket?.status || "")
  const [statusUpdate, setStatusUpdate] = useState("")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "novo":
        return "bg-red-100 text-red-800"
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      case "resolvido":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // If ticket not found, render 404-like UI
  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">
              Ticket não localizado!
            </h1>
            <Button onClick={() => router.push("/")} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para a tela inicial
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // const handleStatusUpdate = () => {
  //   if (statusUpdate.trim()) {
  //     // In real app, this would make an API call
  //     console.log("Status update:", {
  //       status: newStatus,
  //       message: statusUpdate,
  //     })
  //     setStatusUpdate("")
  //     // Update ticket status
  //     mockTicketData[ticketId as keyof typeof mockTicketData] = {
  //       ...ticket,
  //       status: newStatus,
  //     }
  //   }
  // }

  const handleFilesAdd = (files: File[]) => {
    console.log(
      "New files added:",
      files.map((f) => f.name)
    )
    // In real app, this would upload files to server
  }

  const statuses = ["NOVO", "PENDENTE", "RESOLVIDO", "CANCELADO"]

  return (
    <div className="container py-4">
      <div className="grid grid-cols-2 grid-rows-[auto_auto_auto_1fr] gap-y-2">
        <div className="col-span-2 row-start-1 py-2">
          <h1 className="text-3xl font-bold flex items-center gap-4">
            <Package className="h-8 w-8 text-red-500" />
            <span>Ticket de divergência - {ticketId.split("-")} </span>
          </h1>
          <div className="flex flex-row items-start justify-between gap-8 py-4">
            <Button variant={"link"} className="flex items-center gap-2">
              <Link
                href="/divergencias"
                className="gap-2 flex items-center flex-row"
              >
                <ChevronLeft />
                <span>Voltar</span>
              </Link>
            </Button>

            <Badge
              className={`${getStatusColor(ticket.status.toString())} text-lg px-4 py-2`}
            >
              {ticket.status}
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Ticket Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Informações do ticket
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Store className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Loja</p>
                        <p className="font-medium">{ticket.loja}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Data de solicitação
                        </p>
                        <p className="font-medium">
                          {new Date(
                            ticket.dataSolicitacao
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Dias em aberto</p>
                        <p className="font-medium">
                          {ticket.diasEmAberto} dias
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Nota de entrada</p>
                        <p className="font-medium">{ticket.nota}</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">Fornecedor</p>
                    <p className="font-medium">{ticket.fornecedor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Descrição</p>
                    <p
                      className="text-gray-900"
                      dangerouslySetInnerHTML={{
                        __html: ticket.descricao
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\*(.*?)\*/g, "<em>$1</em>")
                          .replace(/\n/g, "<br>"),
                      }}
                    ></p>
                  </div>
                </CardContent>
              </Card>
              {/* Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Produtos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 p-8">
                    {ticket.produtos.map(
                      (product: ProductDivergence, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {product.codigo_produto}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qtd: {product.quantidade}
                            </p>
                            <p className="text-sm text-gray-500">
                              Tipo de divergência: {product.tipo}
                            </p>
                          </div>
                          <p className="font-medium">R$ {product.valor}</p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
              {/* Conversation History */}
              <ConversationHistory
                ticketId={ticket.id.toString()}
                userRole={currentUserRole}
              />
              {/* File Downloads */}
              <FileDownload
                attachments={arquivos?.attachments || []}
                onFilesAdd={handleFilesAdd}
                // canUpload={currentUserRole === "ADMIN_GUARANTEE"}
              />
            </div>

            {/* Right Column - Status Update */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atualização de status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Novo Status</label>
                    <Select
                      value={newStatus.toString()}
                      onValueChange={setNewStatus}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Atualizar mensagem
                    </label>
                    <RichTextEditor
                      value={statusUpdate}
                      onChange={setStatusUpdate}
                    />
                  </div>

                  <Button
                    // onClick={handleStatusUpdate}
                    className="w-full"
                    disabled={
                      !statusUpdate.trim() || newStatus === ticket.status
                    }
                  >
                    Atualizar status
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
