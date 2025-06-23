"use client"

import { useState } from "react"
import { Clock, MessageCircle, Shield } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "@/app/components/rich-text-editor"

interface ConversationHistoryProps {
  ticketId: string
  userRole: "ADMIN_GUARANTEE" | "USER"
}

// Mock conversation data
const mockConversations = {
  "WR-001": [
    {
      id: 1,
      author: "João Silva",
      role: "USER",
      message:
        "O produto apresentou defeito após 2 semanas de uso. A tela está com riscos e não liga mais.",
      timestamp: "2024-01-15T10:30:00Z",
      isInternal: false,
    },
    {
      id: 2,
      author: "Ana Costa",
      role: "ADMIN_GUARANTEE",
      message:
        "Recebemos sua solicitação. Vamos analisar o caso e entrar em contato em até 24 horas.",
      timestamp: "2024-01-15T14:20:00Z",
      isInternal: false,
    },
    {
      id: 3,
      author: "Carlos Admin",
      role: "ADMIN_GUARANTEE",
      message:
        "**INTERNO:** Cliente relatou problema na tela. Verificar se está dentro da garantia. Produto comprado em 01/01/2024.",
      timestamp: "2024-01-15T14:25:00Z",
      isInternal: true,
    },
    {
      id: 4,
      author: "Ana Costa",
      role: "ADMIN_GUARANTEE",
      message:
        "Olá João, analisamos seu caso e o produto está dentro da garantia. Por favor, leve o produto até nossa loja para avaliação técnica.",
      timestamp: "2024-01-16T09:15:00Z",
      isInternal: false,
    },
  ],
  "WR-002": [
    {
      id: 1,
      author: "Maria Santos",
      role: "USER",
      message: "O dispositivo eletrônico parou de funcionar completamente.",
      timestamp: "2024-01-10T11:00:00Z",
      isInternal: false,
    },
  ],
  "WR-003": [
    {
      id: 1,
      author: "Pedro Costa",
      role: "USER",
      message: "Produto com defeito de fabricação.",
      timestamp: "2024-01-08T16:30:00Z",
      isInternal: false,
    },
    {
      id: 2,
      author: "Ana Costa",
      role: "ADMIN_GUARANTEE",
      message: "Produto substituído com sucesso. Caso resolvido.",
      timestamp: "2024-01-10T10:00:00Z",
      isInternal: false,
    },
  ],
}

export function ConversationHistory({
  ticketId,
  userRole,
}: ConversationHistoryProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isInternal, setIsInternal] = useState(false)
  const [conversations, setConversations] = useState(
    mockConversations[ticketId as keyof typeof mockConversations] || []
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newConversation = {
        id: conversations.length + 1,
        author:
          userRole === "ADMIN_GUARANTEE" ? "Current Admin" : "Current User",
        role: userRole,
        message: newMessage,
        timestamp: new Date().toISOString(),
        isInternal: isInternal && userRole === "ADMIN_GUARANTEE",
      }

      setConversations([...conversations, newConversation])
      setNewMessage("")
      setIsInternal(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("pt-BR")
  }

  const getAuthorInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const filteredConversations = conversations.filter((conv) => {
    // Users can't see internal messages
    if (userRole === "USER" && conv.isInternal) {
      return false
    }
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
                      conversation.role === "ADMIN_GUARANTEE"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getAuthorInitials(conversation.author)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {conversation.author}
                    </span>
                    {conversation.role === "ADMIN_GUARANTEE" && (
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                    {conversation.isInternal &&
                      userRole === "ADMIN_GUARANTEE" && (
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
                      conversation.role === "ADMIN_GUARANTEE"
                        ? conversation.isInternal
                          ? "bg-orange-50 border border-orange-200"
                          : "bg-blue-50 border border-blue-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div
                      className="text-sm prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: conversation.message
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
        <div className="border-t pt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Adicionar mensagem</label>
              {userRole === "ADMIN_GUARANTEE" && (
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
      </CardContent>
    </Card>
  )
}
