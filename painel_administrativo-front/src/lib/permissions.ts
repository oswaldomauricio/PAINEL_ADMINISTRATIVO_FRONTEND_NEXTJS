import type { Permissions, Roles } from "@/types/roles"

export const permissions: Record<Roles, Permissions[]> = {
  ROLE_ADMIN: [
    "read:ticket",
    "delete:ticket",
    "update:ticket",
    "create:ticket",
    "create:ticketMensagem",
    "read:internalTicketMensagem",
    "update:ticketStatus",
    "create:usuario",
    "create:loja_usuario",
  ],
  ROLE_USER_COMPRAS: [
    "read:ticket",
    "delete:ticket",
    "update:ticket",
    "create:ticket",
    "create:ticketMensagem",
    "read:internalTicketMensagem",
    "update:ticketStatus",
  ],
  ROLE_ADMIN_COMPRAS: [
    "read:ticket",
    "delete:ticket",
    "update:ticket",
    "create:ticket",
    "create:ticketMensagem",
    "read:internalTicketMensagem",
    "update:ticketStatus",
  ],
  ROLE_USER_GERENTE: ["read:ticket", "create:ticket", "create:ticketMensagem"],
  ROLE_USER: ["read:ticket", "create:ticket", "create:ticketMensagem"],
  ROLE_USER_ESTOQUE: ["read:ticket"],
  ROLE_REGIONAL: ["read:ticket"],
}

// Função helper para verificar se um role tem permissão
export function hasPermission(role: Roles, permission: Permissions): boolean {
  return permissions[role]?.includes(permission) ?? false
}
