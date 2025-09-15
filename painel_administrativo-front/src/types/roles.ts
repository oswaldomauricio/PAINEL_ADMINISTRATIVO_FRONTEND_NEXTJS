export type Roles =
  | "ROLE_ADMIN"
  | "ROLE_USER"
  | "ROLE_USER_GERENTE"
  | "ROLE_USER_COMPRAS"
  | "ROLE_USER_ESTOQUE"
  | "ROLE_REGIONAL"
  | "ROLE_ADMIN_COMPRAS"

export type Permissions =
  | "read:ticket" // ler tickets
  | "delete:ticket" // excluir tickets (não implementado)
  | "update:ticket" // editar tickets (não implementado)
  | "create:ticket" //abrir novos tickets
  | "create:ticketMensagem" //enviar novas mensagens
  | "read:internalTicketMensagem" //ler as mensagens internas
  | "update:ticketStatus" //alterar status do ticket
  | "create:usuario" //criar novos usuarios
  | "create:loja_usuario" //criar novos usuarios e vincular a loja
