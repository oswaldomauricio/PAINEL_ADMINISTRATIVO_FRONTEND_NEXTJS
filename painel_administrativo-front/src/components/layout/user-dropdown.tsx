// import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { HousePlus, LogOut, User } from "lucide-react"

import type { Roles } from "@/types/roles"

import { userData } from "@/data/user"

import { hasPermission } from "@/lib/permissions"
import { firstLetterUpperCase, getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserDropdown() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const RoleUser = () => {
    return session?.user?.role?.replaceAll("_", ": ").replaceAll("Role", "")
  }

  useEffect(() => {
    if (status === "loading") return
  }, [status])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-lg"
          aria-label="User"
        >
          <Avatar className="size-9">
            <AvatarImage src={userData?.avatar} alt="" />
            <AvatarFallback className="bg-transparent">
              {session?.user.name && getInitials(session?.user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent forceMount>
        <DropdownMenuLabel className="flex gap-2">
          <Avatar>
            <AvatarImage src={userData?.avatar} alt="Avatar" />
            <AvatarFallback className="bg-transparent">
              {session?.user.name && getInitials(session?.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-medium truncate">
              {session?.user.name?.toUpperCase()}
            </p>
            <p className="text-xs text-muted-foreground font-semibold truncate mr-12">
              {firstLetterUpperCase(RoleUser() || "")}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hasPermission(session?.user.role as Roles, "create:usuario") && (
          <DropdownMenuGroup className="">
            <DropdownMenuItem onClick={() => router.push("/usuario/registrar")}>
              <User className="me-2 size-4" />
              Criar usuário
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
        )}
        {hasPermission(session?.user.role as Roles, "create:loja_usuario") && (
          <DropdownMenuGroup className="">
            <DropdownMenuItem
              onClick={() => router.push("/usuario/adicionar-loja")}
            >
              <HousePlus className="me-2 size-4" />
              Adicionar usuário à loja
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
        )}
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-red-500/10 text-red-500 hover:bg-red-500/20 focus:bg-red-500/20"
        >
          <LogOut className="me-2 size-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
