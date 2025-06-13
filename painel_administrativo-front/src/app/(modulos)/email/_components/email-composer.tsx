"use client"

import { Card, CardContent } from "@/components/ui/card"
import { EmailComposerForm } from "./email-composer-form"

// import { EmailMenuButton } from "./email-menu-button"

export function EmailComposer() {
  return (
    <Card className="flex-1 w-full flex flex-col md:w-auto">
      <CardContent className="flex-1 h-full p-0">
        <EmailComposerForm />
      </CardContent>
    </Card>
  )
}
