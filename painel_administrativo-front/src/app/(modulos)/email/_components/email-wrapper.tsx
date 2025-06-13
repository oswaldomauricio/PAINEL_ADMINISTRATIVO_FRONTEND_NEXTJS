import type { ReactNode } from "react"
import type { EmailSidebarItemsType, EmailType } from "../types"

// import { EmailSidebar } from "./email-sidebar"

export function EmailWrapper({
  children,
}: {
  emailsData: EmailType[]
  sidebarItemsData: EmailSidebarItemsType
  children: ReactNode
}) {
  return (
    <section className="container h-full w-full flex gap-4 p-4">
      {children}
    </section>
  )
}
