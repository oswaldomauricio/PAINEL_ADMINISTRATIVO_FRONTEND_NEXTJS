"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Files } from "@/app/service/FileService"
import { TicketStatusService } from "@/app/service/TicketStatusService"
import { TicketDivergencia } from "@/app/service/TicketsDivergenciaService"
import { toast } from "sonner"
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ClipboardList,
  Clock,
  FileText,
  Package,
  Printer,
  Store,
} from "lucide-react"

import type { Attachment } from "@/app/components/file-download"
import type {
  ProductDivergence,
  divergenciasType,
} from "@/app/dashboard/types/types"
import type { StatusHandler } from "@/app/service/TicketStatusService"
import type { Roles } from "@/types/roles"
import { StatusTicketDivergencia } from "@/app/dashboard/types/types"

import { hasPermission } from "@/lib/permissions"
import { getStatusColor, handlePrint } from "@/lib/utils"

import { useApi } from "@/hooks/use-api"
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

const ticketDivergenciaService = new TicketDivergencia()

const fileService = new Files()

const ticketStatusService = new TicketStatusService()

export default function TicketPage() {
  const params = useParams()
  const ticketId = params.id as string
  const id = ticketId
  const router = useRouter()

  const { apiCall, token, user } = useApi()

  const [ticket, setTicket] = useState<divergenciasType>()
  const [newStatus, setNewStatus] = useState(ticket?.status || "")
  const [statusUpdate, setStatusUpdate] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusHistory, setStatusHistory] = useState<StatusHandler[]>([])
  const statuses = Object.values(StatusTicketDivergencia).filter(
    (value) => typeof value === "string"
  )

  const statusMap: Record<string, StatusTicketDivergencia> = {
    CANCELADO: StatusTicketDivergencia.CANCELADO,
    CONCLUIDO: StatusTicketDivergencia.CONCLUIDO,
  }

  const isTicketLocked = ticket
    ? [
        StatusTicketDivergencia.CANCELADO,
        StatusTicketDivergencia.CONCLUIDO,
      ].includes(statusMap[ticket.status as unknown as StatusTicketDivergencia])
    : false

  const fetchData = useCallback(async () => {
    if (!token || !id) {
      setIsLoading(false)
      return
    }
    try {
      const ticketResult = await ticketDivergenciaService.listarTicketsPorId(
        apiCall,
        id
      )
      setTicket(ticketResult || undefined)
      if (ticketResult) {
        setNewStatus(ticketResult.status || "")
      }

      const arquivosResult = await fileService.listarArquivosPorTicket(
        apiCall,
        id + 200 // Adiciona 200 para diferenciar dos tickets de garantia
      )
      setAttachments(arquivosResult)

      const historico = await ticketStatusService.listarStatusDivergencia(
        apiCall,
        Number(id)
      )
      setStatusHistory(
        historico ? (historico as unknown as StatusHandler[]) : []
      )
    } catch (error) {
      console.error("Erro ao buscar dados do ticket ou arquivos:", error)
      toast.error("Falha ao carregar dados do ticket.")
    } finally {
      setIsLoading(false)
    }
  }, [token, apiCall, id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleFilesAdd = async (files: File[]) => {
    if (!files || files.length === 0) {
      toast.warning("Nenhum arquivo selecionado.")
      return
    }

    setIsUploading(true)
    toast.info("Iniciando upload dos arquivos...")

    try {
      const renamedFiles = files.map((file) => {
        const fileExtension = file.name.split(".").pop()
        const fileNameWithoutExt = file.name.substring(
          0,
          file.name.lastIndexOf(".")
        )
        const uniqueName = `${fileNameWithoutExt}_${Date.now()}.${fileExtension}`
        return new File([file], uniqueName, { type: file.type })
      })

      const result = await fileService.uploadMultipleFiles(
        apiCall,
        ticketId + 100,
        renamedFiles
      )

      if (result) {
        toast.success(`${files.length} arquivo(s) enviado(s) com sucesso!`)
        await fetchData()
      } else {
        throw new Error("A resposta do upload foi nula.")
      }
    } catch (error) {
      console.error("Falha no upload:", error)
      toast.error(`Falha no upload, tente novamente!`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!ticket || !user?.id) {
      toast.error("Dados do ticket ou do usuário não encontrados.")
      return
    }

    if (!statusUpdate.trim()) {
      toast.warning("A mensagem de atualização não pode estar vazia.")
      return
    }

    const data = {
      ticketId: ticket.id,
      status: newStatus as unknown as StatusTicketDivergencia,
      idUser: user.id,
      mensagem: statusUpdate,
    }

    toast.info("Atualizando status do ticket...")

    try {
      const result = await ticketStatusService.atualizarStatusDivergencia(
        apiCall,
        data
      )

      if (result) {
        setStatusUpdate("")
        await fetchData()
      }
    } catch (error) {
      toast.error("Falha ao atualizar o status no componente:")
      console.error("Falha ao atualizar o status no componente:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"
          role="status"
        >
          <span className="sr-only">Carregando...</span>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">
              Ticket não localizado!
            </h1>
            <Button
              onClick={() => router.push("/dashboard/divergencias")}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para a tela inicial
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="grid grid-cols-2 grid-rows-[auto_auto_auto_1fr] gap-y-2">
        <div className="col-span-2 row-start-1 py-2">
          <h1 className="text-3xl font-bold flex items-center gap-4">
            <Package className="h-8 w-8 text-red-500" />
            <span>Ticket de divergência - {ticketId.split("-")} </span>
          </h1>
          <div className="flex flex-row items-start justify-between gap-8 py-4">
            <div className="flex items-center gap-8">
              <Button variant={"link"} className="flex items-center gap-8">
                <Link
                  href="/dashboard/garantias"
                  className="gap-2 flex items-center flex-row"
                >
                  <ChevronLeft />
                  <span>Voltar</span>
                </Link>
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex items-center gap-2 print:hidden"
              >
                <Printer size={18} />
                Imprimir / PDF
              </Button>
            </div>

            <Badge
              className={`${getStatusColor(ticket.status.toString())} text-lg px-4 py-2`}
            >
              {ticket.status.toString().replaceAll("_", " ")}
            </Badge>
          </div>
          <div
            className={`grid grid-cols-1 gap-6 ${
              user?.role &&
              hasPermission(user.role as Roles, "update:ticketStatus")
                ? "lg:grid-cols-3"
                : "lg:grid-cols-2"
            }`}
          >
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
                            ticket.data_solicitacao
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Dias em aberto</p>
                        <p className="font-medium">
                          {ticket.dias_em_aberto} dias
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
                          </div>
                          <p className="font-medium">
                            {product.tipo_divergencia}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Histórico de conversas */}
              <ConversationHistory
                tipo_ticket="DIVERGENCIA"
                ticketId={ticket.id.toString()}
                userRole={user?.role as Roles}
                canReply={!isTicketLocked}
              />
              <div className="print:hidden">
                <FileDownload
                  onFileRemove={() => console.log("não é possivel excluir")}
                  attachments={attachments}
                  canUpload={!isTicketLocked}
                  onFilesAdd={handleFilesAdd}
                  isUploading={isUploading}
                />
              </div>
              {/* Histórico de status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Histórico de status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 p-6">
                    {statusHistory.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        Nenhum histórico disponível.
                      </p>
                    ) : (
                      statusHistory.map((hist, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-gray-50 flex flex-col gap-2"
                        >
                          <div className="flex justify-between items-center">
                            <span
                              className={`font-semibold px-4 py-2 rounded-3xl ${getStatusColor(
                                hist.statusNovo.toString()
                              )}`}
                            >
                              {hist.statusNovo}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(hist.dataAtualizacao).toLocaleString(
                                "pt-BR"
                              )}
                            </span>
                          </div>
                          <p className="text-gray-800">{hist.mensagem}</p>
                          <span className="text-xs text-gray-400">
                            Alterado por: <strong>{hist.alteradoPor}</strong>
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Status Update */}
            {user?.role &&
              hasPermission(user.role as Roles, "update:ticketStatus") && (
                <div className="space-y-6">
                  {isTicketLocked ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Ticket Finalizado</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <p className="text-sm text-gray-600">
                          Este ticket não pode mais ser alterado pois seu status
                          atual é{" "}
                          {ticket.status.toString().replaceAll("_", " ")}.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="print:hidden">
                      <CardHeader>
                        <CardTitle>Atualização de status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 p-8">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Novo Status
                          </label>
                          <Select
                            value={newStatus.toString()}
                            onValueChange={setNewStatus}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statuses.map((status) => (
                                <SelectItem
                                  key={status}
                                  value={status.toString()}
                                >
                                  {status.replaceAll("_", " ")}
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
                          onClick={handleStatusUpdate}
                          className="w-full"
                          disabled={
                            !statusUpdate.trim() || newStatus === ticket.status
                          }
                        >
                          Atualizar status
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
