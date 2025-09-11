"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
// import { ModeDropdown } from "@/components/layout/mode-dropdown"
import { UserDropdown } from "@/components/layout/user-dropdown"
import { ToggleMobileSidebar } from "../toggle-mobile-sidebar"

export function VerticalLayoutHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-secondary border-b border-sidebar-border">
      <div className="container flex h-14 justify-between items-center gap-4">
        <ToggleMobileSidebar />
        <div className="grow flex justify-end gap-2">
          <SidebarTrigger className="hidden lg:flex lg:me-auto" />
          {/* <ModeDropdown /> */}
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}
