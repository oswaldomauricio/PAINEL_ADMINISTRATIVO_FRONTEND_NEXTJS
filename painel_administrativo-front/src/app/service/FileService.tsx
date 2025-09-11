import type { Attachment, FileDownloadProps } from "../components/file-download"
import type { FileUpload } from "../dashboard/types/types"

type ApiCallFunction = (url: string, options: RequestInit) => Promise<unknown>

interface PaginatedResponse<T> {
  content: T[]
}

interface FileFromApi {
  id: number
  fileName: string
  fileSize: number
  ticketId: number
  urlDownload: string
}

export class Files {
  /**
   * Envia múltiplos arquivos para um ticket específico usando multipart/form-data.
   * @param apiCall A função que executa a chamada para a API.
   * @param id_ticket O ID do ticket para associar os arquivos.
   * @param files Um array de objetos File a serem enviados.
   * @returns Uma promessa que resolve para FileUpload ou null.
   */
  async uploadMultipleFiles(
    apiCall: ApiCallFunction,
    id_ticket: string | number,
    files: File[]
  ): Promise<FileUpload[] | null> {
    if (!id_ticket) {
      console.warn("Ticket não encontrado ou não fornecido!")
      return null
    }

    if (!files || files.length === 0) {
      console.warn("Nenhum arquivo foi fornecido para upload!")
      return null
    }

    try {
      const formData = new FormData()

      files.forEach((file) => {
        formData.append("files", file)
      })

      const response = (await apiCall(
        `/v1/file/uploadMultipleFiles/${id_ticket}`,
        {
          method: "POST",
          body: formData,
        }
      )) as FileUpload[]

      return response || null

      return null
    } catch (error) {
      console.error("Erro ao fazer upload de arquivos no serviço:", error)
      throw error
    }
  }

  async listarArquivosPorTicket(
    apiCall: ApiCallFunction,
    id_ticket: string | number
  ): Promise<FileDownloadProps["attachments"]> {
    try {
      const response = (await apiCall(`/v1/file/${id_ticket}`, {
        method: "GET",
      })) as PaginatedResponse<FileFromApi>

      if (response && response.content) {
        const attachments: Attachment[] = response.content.map((file) => ({
          id: file.id,
          name: file.fileName,
          size: file.fileSize,
          fileDownloadUri: file.urlDownload,
          type: this.getMimeType(file.fileName),
          uploadedBy: "",
          uploadedAt: new Date().toISOString(),
        }))

        return attachments
      }

      return []
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido"
      console.warn("Nenhum arquivo encontrado ou erro ao buscar:", message)
      return []
    }
  }

  private getMimeType(fileName: string): string {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return "application/pdf"
      case "jpg":
      case "jpeg":
        return "image/jpeg"
      case "png":
        return "image/png"
      case "gif":
        return "image/gif"
      case "zip":
        return "application/zip"
      case "rar":
        return "application/x-rar-compressed"
      case "doc":
        return "application/msword"
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      default:
        return "application/octet-stream"
    }
  }
}
