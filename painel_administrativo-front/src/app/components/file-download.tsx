"use client"

import { useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
  Calendar,
  Download,
  File,
  FileArchive,
  FileText,
  ImageIcon,
  Plus,
  Upload,
  User,
  X,
} from "lucide-react"

import type React from "react"

import { truncateName } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface Attachment {
  id: number
  name: string
  size: number
  type: string
  uploadedBy: string
  uploadedAt: string
  fileDownloadUri?: string
}

export interface FileDownloadProps {
  attachments: Attachment[]
  onFilesAdd: (files: File[]) => void
  onFileRemove: (fileId: number) => void
  canUpload?: boolean
  isUploading?: boolean
}

export function FileDownload({
  attachments,
  onFilesAdd,
  onFileRemove,
  canUpload = true,
  isUploading = false,
}: FileDownloadProps) {
  const { data: session } = useSession()
  const apiToken = session?.user.apiToken

  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    )
  }

  const getFileIcon = (type: string) => {
    if (!type) {
      return <File className="h-5 w-5 text-gray-600" />
    }

    if (type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-600" />
    } else if (type === "application/pdf") {
      return <FileText className="h-5 w-5 text-red-600" />
    } else if (type.includes("zip") || type.includes("rar")) {
      return <FileArchive className="h-5 w-5 text-yellow-600" />
    }

    // Retorno padrão caso o tipo não corresponda a nenhuma condição
    return <File className="h-5 w-5 text-gray-600" />
  }
  const getFileTypeLabel = (type: string) => {
    if (type.startsWith("image/")) return "Image"
    if (type === "application/pdf") return "PDF"
    if (type.includes("zip")) return "ZIP"
    if (type.includes("rar")) return "RAR"
    if (type.includes("document")) return "Document"
    return "File"
  }

  const handleDownload = async (attachment: Attachment) => {
    console.log("Tentando baixar da URL:", attachment.fileDownloadUri)
    if (!attachment.fileDownloadUri) {
      toast.error("URL de download não encontrada.")
      console.error("URI de download não encontrada para:", attachment.name)
      return
    }

    // Verificação extra para garantir que o token existe antes de tentar o download
    if (!apiToken) {
      toast.error("Você precisa estar logado para baixar arquivos.")
      console.error("Token de autenticação não encontrado.")
      return
    }

    try {
      toast.info(`Baixando "${attachment.name}"...`)

      const response = await fetch(attachment.fileDownloadUri, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || `Erro na rede: ${response.statusText}`
        )
      }

      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = attachment.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Falha ao baixar o arquivo:", error)
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível baixar o arquivo."
      toast.error(message)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const fileArray = Array.from(files)
    // A única responsabilidade é notificar o componente pai.
    if (onFilesAdd) {
      onFilesAdd(fileArray)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Anexos ({attachments.length})
          </div>
          {canUpload && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar arquivos
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        {canUpload && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.rar"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600">
                  Fazendo upload de arquivos...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">
                    Solte os arquivos aqui ou clique para navegar
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Suporte para PDF, DOC, JPG, PNG, ZIP (Max 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Files List */}
        {attachments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum arquivo anexado a este tíquete.</p>
            {canUpload && (
              <p className="text-sm mt-2">
                Use a área acima para carregar arquivos.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1">
                  {getFileIcon(attachment.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {truncateName(attachment.name, 60)}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {getFileTypeLabel(attachment.type)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <File className="h-3 w-3" />
                        {formatFileSize(attachment.size)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {attachment.uploadedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(attachment.uploadedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(attachment)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  {canUpload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFileRemove(attachment.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Download All Button */}
        {attachments.length > 1 && (
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => console.log("Downloading all files as ZIP")}
            >
              <Download className="h-4 w-4" />
              Baixar todos ({attachments.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
