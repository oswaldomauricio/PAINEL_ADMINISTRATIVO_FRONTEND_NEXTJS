import type { Metadata } from "next"
import type { ReactNode } from "react"

// Define metadata for the page
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata: Metadata = {
  title: "Tickets - Email",
}

export default function EmailLayout({ children }: { children: ReactNode }) {
  return <section>{children}</section>
}
