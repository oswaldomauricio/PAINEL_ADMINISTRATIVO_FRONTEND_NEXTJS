import Link from "next/link"
import { ChevronLeft, Package } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NovoPage() {
  return (
    <div className="container py-4">
      <div className="grid grid-cols-3 grid-rows-[auto_auto_auto_1fr] gap-y-2">
        <div className="col-span-2 row-start-1 py-2">
          <h1 className="text-3xl font-bold flex items-center gap-4">
            <Package className="h-8 w-8 text-red-500" />
            <span>Inserir nova solicitação de garantia</span>
          </h1>
          <div className="flex flex-row items-start gap-8">
            <Button variant={"link"} className="flex items-center gap-2">
              <Link
                href="/garantias"
                className="gap-2 flex items-center flex-row"
              >
                <ChevronLeft />
                <span>Voltar</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
