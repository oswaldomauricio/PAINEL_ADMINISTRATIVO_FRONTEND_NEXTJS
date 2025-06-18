"use client"

import { use, useRef } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ChevronLeft, Wrench } from "lucide-react"

import type { Editor } from "tinymce"

import { Button } from "@/components/ui/button"
import UploadComponent from "@/app/components/upload"

const BundledEditor = dynamic(() => import("@/BundledEditor"), {
  ssr: false,
})

export default function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const editorRef = useRef<Editor>(null)

  // const onFinish = () => {
  //   const data = { conteudo: editorRef.current?.getContent() }
  //   console.log(data)
  // }

  return (
    <div className="container py-4">
      <div className="grid grid-cols-2 grid-rows-[auto_auto_auto_1fr] gap-y-1">
        <div className="col-span-2 row-start-1 py-2">
          <h1 className="text-3xl font-bold flex items-center gap-4">
            <Wrench className="h-8 w-8 text-red-500" />
            <span>Ticket de garantia - {id}</span>
          </h1>
          <div className="flex flex-row items-start justify-between mt-2 mb-2">
            <Button variant={"link"} className="flex items-center">
              <Link href="/garantias" className="flex items-center flex-row">
                <ChevronLeft />
                <span>Voltar</span>
              </Link>
            </Button>
            <div className="rounded-xl bg-amber-200 w-20 h-8 flex items-center justify-center">
              <span className="font-bold">Status</span>
            </div>
          </div>
          <div className="grid grid-cols-2 grid-rows-6">
            <div className="col-span-2 row-start-1">
              <BundledEditor
                onInit={(_evt: unknown, editor: Editor) =>
                  (editorRef.current = editor)
                }
                init={{
                  height: 300,
                  menubar: false,
                  statusbar: false,
                  plugins: [
                    "advlist",
                    "anchor",
                    "autolink",
                    "image",
                    "link",
                    "lists",
                    "searchreplace",
                    "table",
                    "wordcount",
                  ],
                  help_accessibility: false,
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | link image",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
              <div className="col-span-2 row-start-2">
                {" "}
                <UploadComponent height={80} iconSize={40} text={false} />
                <Button variant={"default"} className="w-full mt-2">
                  Enviar mensagem
                </Button>
              </div>
            </div>
            <div className="col-span-2 row-start-3 py-1"></div>
            <div className="col-span-2 row-start-4 py-1">4</div>
            <div className="col-span-2 row-start-5 py-1">5</div>
          </div>
        </div>
      </div>
    </div>
  )
}
