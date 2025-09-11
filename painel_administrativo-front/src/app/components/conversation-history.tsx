"use client"

import { useEffect, useState } from "react"
import { Clock, MessageCircle, Shield } from "lucide-react"

import type { Roles } from "@/types/roles"
import type { Mensagem } from "../service/TicketMessageService"

import { hasPermission } from "@/lib/permissions"

import { useApi } from "@/hooks/use-api"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "@/app/components/rich-text-editor"
import { TicketMessageService } from "../service/TicketMessageService"

interface ConversationHistoryProps {
  ticketId: string | number
  userRole: Roles
  tipo_ticket: "GARANTIA" | "DIVERGENCIA"
  canReply?: boolean
}

export function ConversationHistory({
  ticketId,
  userRole,
  tipo_ticket,
  canReply = true,
}: ConversationHistoryProps) {
  const { apiCall, user } = useApi()
  const [newMessage, setNewMessage] = useState("")
  const [isInternal, setIsInternal] = useState(false)
  const [conversations, setConversations] = useState<Mensagem[]>([])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const service = new TicketMessageService()
        const msgs = await service.listarMensagens(
          apiCall,
          ticketId,
          tipo_ticket
        )
        setConversations(msgs as Mensagem[])
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error)
      }
    }

    fetchMessages()
  }, [ticketId, tipo_ticket, apiCall])

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const service = new TicketMessageService()
        const created = await service.criarNovaMensagem(
          apiCall,
          {
            ticketId: Number(ticketId),
            id_usuario: user?.id,
            msg: newMessage,
            internal: isInternal && userRole.includes("ADMIN"),
          },
          tipo_ticket
        )

        if (created) {
          setConversations((prev) => [...prev, created])
        }
        setNewMessage("")
        setIsInternal(false)
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error)
      }
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("pt-BR")
  }

  const getAuthorInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  const filteredConversations = conversations.filter((conv) => {
    if (userRole.includes("USER") && conv.internal) return false
    return true
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Mensagens
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        {/* Messages */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div key={conversation.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback
                    className={`text-xs ${
                      conversation.usuario.role === "ROLE_USER"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {getAuthorInitials(conversation.usuario.login)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {conversation.usuario.login}
                    </span>
                    {conversation.usuario.role !== "ROLE_USER" && (
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                    {conversation.internal &&
                      hasPermission(
                        user?.role as Roles,
                        "create:ticketMensagem"
                      ) && (
                        <Badge
                          variant="outline"
                          className="text-xs text-orange-600 border-orange-200"
                        >
                          Interno
                        </Badge>
                      )}
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(conversation.timestamp)}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-lg ${
                      conversation.usuario.role !== "ROLE_USER"
                        ? conversation.internal
                          ? "bg-orange-50 border border-orange-200"
                          : "bg-blue-50 border border-blue-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div
                      className="text-sm prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: conversation.msg
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\*(.*?)\*/g, "<em>$1</em>")
                          .replace(/\n/g, "<br>"),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Message Form */}
        {canReply && (
          <div className="border-t pt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Adicionar mensagem
                </label>
                {hasPermission(
                  user?.role as Roles,
                  "read:internalTicketMensagem"
                ) && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="internal"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="internal" className="text-sm text-gray-600">
                      Mensagem interna
                    </label>
                  </div>
                )}
              </div>

              <RichTextEditor value={newMessage} onChange={setNewMessage} />
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="w-full"
            >
              Enviar mensagem
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
