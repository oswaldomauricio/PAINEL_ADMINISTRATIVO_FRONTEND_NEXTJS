"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Package, Plus } from "lucide-react"

import type React from "react"
import type {
  CriarDivergenciaDTO,
  ProductDivergence,
} from "../dashboard/types/types"

import {
  validateCpfCnpj,
  validateDescricao,
  validateNota,
  validateProdutosDivergencia,
} from "@/lib/utils"

import { useStore } from "@/contexts/lojaContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/app/components//rich-text-editor"
import { ProductInput } from "@/app/components/product-input-divergence"
import SelectLojas from "./ui/select-lojas"

interface NewRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CriarDivergenciaDTO) => void
}

export function NewRequestModalDivergence({
  isOpen,
  onClose,
  onSubmit,
}: NewRequestModalProps) {
  const { store } = useStore()
  const { data: session } = useSession()
  const [fornecedor, setFornecedor] = useState("")
  const [nota, setNota] = useState("")
  const [cpfCnpj, setCpfCnpj] = useState("")
  const [descricao, setDescricao] = useState("")
  const [produtos, setProdutos] = useState<ProductDivergence[]>([
    { codigo_produto: "", quantidade: 0, tipo_divergencia: "" },
  ])

  const addProduct = () => {
    setProdutos([
      ...produtos,
      { codigo_produto: "", quantidade: 0, tipo_divergencia: "" },
    ])
  }

  const removeProduct = (index: number) => {
    setProdutos(produtos.filter((_, i) => i !== index))
  }

  const updateProduct = (
    index: number,
    field: keyof ProductDivergence,
    value: string | number
  ) => {
    setProdutos((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const isFormValid = () => {
    return (
      (store &&
        fornecedor.trim().length > 0 &&
        nota.trim().length >= 1 &&
        nota.trim().length <= 9 &&
        cpfCnpj.length === 11) ||
      (cpfCnpj.length === 14 &&
        produtos.length > 0 &&
        produtos.every(
          (p) =>
            p.codigo_produto.trim().length > 0 &&
            p.quantidade > 0 &&
            p.tipo_divergencia.toString().length > 0
        ))
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!store) return

    const payload: CriarDivergenciaDTO = {
      loja: Number(store),
      fornecedor,
      cpf_cnpj: cpfCnpj,
      nota,
      descricao,
      id_usuario: Number(session?.user.id),
      produtos,
    }

    onSubmit(payload)
    toast.success("Ticket criado com sucesso!")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center gap-2">
          <Package className="text-red-500" />
          <DialogTitle>Nova solicitação de divergência</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <SelectLojas title="lojas *" />

              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor *</Label>
                <Input
                  id="supplier"
                  value={fornecedor}
                  onChange={(e) => setFornecedor(e.target.value)}
                  placeholder="Nome do fornecedor"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salesNote">Nota de entrada *</Label>
                <Input
                  id="salesNote"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder="Nota"
                  required
                  minLength={1}
                  maxLength={9}
                />
                {validateNota(nota) && (
                  <p className="text-red-500 text-xs mt-1">
                    {validateNota(nota)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerDocument">
                  CPF/CNPJ do fornecedor *
                </Label>
                <Input
                  id="customerDocument"
                  value={cpfCnpj}
                  onChange={(e) =>
                    setCpfCnpj(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="CPF / CNPJ"
                  required
                  minLength={14}
                  maxLength={14}
                  pattern="^[0-9]{11}$|^[0-9]{14}$"
                />
                {validateCpfCnpj(cpfCnpj) && (
                  <p className="text-red-500 text-xs mt-1">
                    {validateCpfCnpj(cpfCnpj)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Produtos
                <Button
                  type="button"
                  onClick={addProduct}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adcionar Produto
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {produtos.map((product, index) => (
                <ProductInput
                  key={index}
                  product={product}
                  onUpdate={(field, value) =>
                    updateProduct(
                      index,
                      field as keyof ProductDivergence,
                      value
                    )
                  }
                  onRemove={() => removeProduct(index)}
                  canRemove={produtos.length > 1}
                />
              ))}

              {validateProdutosDivergencia(produtos) && (
                <p className="text-red-500 text-xs mt-1">
                  {validateProdutosDivergencia(produtos)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor value={descricao} onChange={setDescricao} />
              {validateDescricao(descricao) && (
                <p className="text-red-500 text-xs mt-1">
                  {validateDescricao(descricao)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>

            {isFormValid() ? (
              <Button type="submit">Enviar solicitação</Button>
            ) : (
              <p className="text-red-500 text-sm flex items-center">
                Preencha todos os campos obrigatórios corretamente para enviar.
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
