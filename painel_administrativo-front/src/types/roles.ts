export type Roles = "ROLE_ADMIN" | "ROLE_USER"

export type Permissions =
  | "read:ticket"
  | "delete:ticket"
  | "update:ticket"
  | "create:ticket"
  | "create:ticketMensagem" //enviar novas mensagens
  | "read:internalTicketMensagem" //ler as mensagens internas
