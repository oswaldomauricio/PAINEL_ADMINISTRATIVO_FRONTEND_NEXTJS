"use client"

import {
  Calendar,
  Download,
  File,
  FileArchive,
  FileText,
  ImageIcon,
  User,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Attachment {
  id: number
  name: string
  size: number
  type: string
  uploadedBy: string
  uploadedAt: string
}

interface FileDownloadProps {
  attachments: Attachment[]
}

export function FileDownload({ attachments }: FileDownloadProps) {
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
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-600" />
    } else if (type === "application/pdf") {
      return <FileText className="h-5 w-5 text-red-600" />
    } else if (type.includes("zip") || type.includes("rar")) {
      return <FileArchive className="h-5 w-5 text-yellow-600" />
    }
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

  const handleDownload = (attachment: Attachment) => {
    // In a real application, this would trigger the actual download
    // For demo purposes, we'll just log the action
    console.log(`Downloading file: ${attachment.name}`)

    // Simulate download by creating a temporary link
    // In production, this would be replaced with actual file URL from your backend
    const link = document.createElement("a")
    link.href = `/placeholder.svg?height=100&width=100` // Placeholder for demo
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  if (!attachments || attachments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 ">
            <Download className="h-5 w-5" />
            Baixar arquivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Não foi adicionado nenhum arquivo a este ticket!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Baixar arquivo ({attachments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 px-8">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                {getFileIcon(attachment.type)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">
                      {attachment.name}
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

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(attachment)}
                className="flex items-center gap-2 ml-4"
              >
                <Download className="h-4 w-4" />
                Baixar
              </Button>
            </div>
          ))}
        </div>

        {/* Download All Button */}
        {attachments.length > 1 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => {
                console.log("Downloading all files as ZIP")
                // In production, this would create a ZIP file with all attachments
              }}
            >
              <Download className="h-4 w-4" />
              Baixar todos os arquivos ({attachments.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
