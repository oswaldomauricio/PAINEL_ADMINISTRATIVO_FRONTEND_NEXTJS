"use client"

// import { useState } from "react"
import { useRef } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { MinusCircleOutlined } from "@ant-design/icons"
import { DatePicker, Form, Input, Select, Space } from "antd"
import { ChevronLeft, Package, SendHorizontal } from "lucide-react"

import type { Editor } from "tinymce"

import { Button } from "@/components/ui/button"

const BundledEditor = dynamic(() => import("@/BundledEditor"), {
  ssr: false,
})

export type NovoPageProps = {
  loja: string
  fornecedor: string
  nota_de_venda: string
  data_de_solicitacao: string
  nome_do_cliente: string
  cpf_cnpj_do_cliente: string
  produtos: {
    Codigo_do_Produto: string
    quantidade: string
  }[]
}

export default function NovoPage() {
  const editorRef = useRef<Editor>(null)

  const onFinish = (values: NovoPageProps) => {
    const data = { ...values, conteudo: editorRef.current?.getContent() }
    console.log(data)
  }

  return (
    <div className="container py-4">
      <div className="grid grid-cols-2 grid-rows-[auto_auto_auto_1fr] gap-y-2">
        <div className="col-span-2 row-start-1 py-2">
          <h1 className="text-3xl font-bold flex items-center gap-4">
            <Package className="h-8 w-8 text-red-500" />
            <span>Inserir nova solicitação de garantia</span>
          </h1>
          <Form
            className="grid grid-cols-2 grid-rows-4 gap-8 justify-between items-center"
            onFinish={onFinish}
            initialValues={{
              produtos: [
                { Codigo_do_Produto: "", quantidade: "", valor_do_produto: "" }, // Item inicial vazio
              ],
            }}
          >
            <div className="flex flex-row items-start gap-8 justify-between">
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
            <div className="flex flex-row items-end justify-end mr-8">
              <Button type="submit" className="gap-4 flex items-center">
                <SendHorizontal size={16} />
                <span>Enviar solicitação</span>
              </Button>
            </div>

            <Form.Item label="Loja" layout="vertical" name="loja">
              <Select>
                <Select.Option value="101">101</Select.Option>
                <Select.Option value="102">102</Select.Option>
                <Select.Option value="103">103</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="* Fornecedor" layout="vertical" name="fornecedor">
              <Input />
            </Form.Item>
            <Form.Item
              label="* Nota de venda"
              layout="vertical"
              name="nota_de_venda"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Data de solicitação"
              layout="vertical"
              name="datePicker"
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="* Nome do cliente"
              layout="vertical"
              name="nome_do_cliente"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="CPF/CNPJ do cliente"
              layout="vertical"
              name="cpf_cnpj_do_cliente"
            >
              <Input />
            </Form.Item>
            <div className="col-span-1 row-start-5">
              <Form.List name="produtos">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} align="baseline">
                        <Form.Item
                          {...restField}
                          name={[name, "Codigo_do_Produto"]}
                        >
                          <Input placeholder="Codigo do Produto" />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, "quantidade"]}>
                          <Input placeholder="Quantidade" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "valor_do_produto"]}
                        >
                          <Input placeholder="Valor do Produto" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="button"
                        onClick={() => add()}
                        className="w-full"
                      >
                        Adicionar Produto
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
            <div className="col-span-2 row-start-6">
              <BundledEditor
                onInit={(_evt: unknown, editor: Editor) =>
                  (editorRef.current = editor)
                }
                // initialValue="<p>${data.loja}</p>"
                init={{
                  height: 500,
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
            </div>
            <div className="col-span-2 row-start-7">test</div>
          </Form>
        </div>
      </div>
    </div>
  )
}
