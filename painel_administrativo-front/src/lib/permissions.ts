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
  ],
  ROLE_USER: ["read:ticket", "create:ticketMensagem"],
}

// Função helper para verificar se um role tem permissão
export function hasPermission(role: Roles, permission: Permissions): boolean {
  return permissions[role]?.includes(permission) ?? false
}
