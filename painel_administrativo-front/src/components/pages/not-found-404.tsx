import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function NotFound404() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-y-6 text-center text-foreground bg-background p-4">
      <div className="flex flex-col-reverse justify-center items-center gap-y-6 md:flex-row md:text-start">
        <Image
          src="/images/illustrations/characters/character-02.svg"
          alt=""
          height={232}
          width={249}
          priority
        />

        <h1 className="inline-grid text-6xl font-black">
          404{" "}
          <span className="text-3xl font-semibold">Pagina não encontrada</span>
        </h1>
      </div>
      <p className="max-w-prose text-xl text-muted-foreground">
        Não existe uma página aqui, mas você pode voltar para a página inicial e
        continuar navegando pelo site.
      </p>
      <Button size="lg" asChild>
        <Link href="/">Pagina inicial</Link>
      </Button>
    </div>
  )
}
