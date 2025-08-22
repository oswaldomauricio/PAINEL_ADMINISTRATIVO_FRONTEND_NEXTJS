import { Cairo, Lato } from "next/font/google"

import "@ant-design/v5-patch-for-react-19"

import { cn } from "@/lib/utils"

import "./globals.css"

import { Providers } from "@/providers"

import type { Metadata } from "next"
import type { ReactNode } from "react"

import { StoreProvider } from "@/contexts/lojaContext"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"

// Define metadata for the application
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata: Metadata = {
  title: {
    template: "%s | Norte auto Peças",
    default: "Painel | Norte auto Peças",
  },
  description: "",
  // metadataBase: new URL("/"),
  // metadataBase: new URL(process.env.BASE_URL as string) || new URL("/"),
}

// Define fonts for the application
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
const latoFont = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-lato",
})
const cairoFont = Cairo({
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal"],
  variable: "--font-cairo",
})

export default function RootLayout(props: { children: ReactNode }) {
  const { children } = props

  return (
    <html lang="pt-BR" dir="ltr" suppressHydrationWarning>
      <body
        className={cn(
          "[&:lang(en)]:font-lato [&:lang(ar)]:font-cairo",
          "bg-[#ffffff] text-foreground antialiased overscroll-none",
          latoFont.variable,
          cairoFont.variable
        )}
      >
        <Providers locale="en">
          {/* -> 2. Envolva os componentes filhos com o StoreProvider */}
          <StoreProvider>
            {children}
            <Toaster />
            <Sonner />
          </StoreProvider>
        </Providers>
      </body>
    </html>
  )
}
