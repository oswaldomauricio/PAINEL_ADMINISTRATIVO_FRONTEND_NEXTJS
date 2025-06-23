"use client"

import { useState } from "react"
import { Package, Plus } from "lucide-react"

import type React from "react"

import { formatToDDMMYYYY } from "@/lib/utils"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RichTextEditor } from "@/app/components//rich-text-editor"
import { FileUpload } from "@/app/components/file-upload"
import { ProductInput } from "@/app/components/product-input-divergence"

interface NewRequestModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void
}

const stores = ["101", "102", "103", "104"]

export function NewRequestModalDivergence({
  isOpen,
  onClose,
  onSubmit,
}: NewRequestModalProps) {
  const [formData, setFormData] = useState({
    store: "",
    supplier: "",
    requestDate: Date.now(),
    supplierDocument: "",
    description: "",
    products: [{ code: "", quantity: "", type: "", EntryNote: "" }],
    files: [] as File[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    // Reset form
    setFormData({
      store: "",
      supplier: "",
      requestDate: Date.now(),
      supplierDocument: "",
      description: "",
      products: [{ code: "", quantity: "", type: "", EntryNote: "" }],
      files: [],
    })
    console.log(formatToDDMMYYYY(formData.requestDate))
  }

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        { code: "", quantity: "", type: "", EntryNote: "" },
      ],
    })
  }

  const removeProduct = (index: number) => {
    const newProducts = formData.products.filter((_, i) => i !== index)
    setFormData({ ...formData, products: newProducts })
  }

  const updateProduct = (index: number, field: string, value: string) => {
    const newProducts = [...formData.products]
    newProducts[index] = { ...newProducts[index], [field]: value }
    setFormData({ ...formData, products: newProducts })
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
              <div className="space-y-4">
                <Label htmlFor="store">Loja *</Label>
                <Select
                  value={formData.store}
                  onValueChange={(value) =>
                    setFormData({ ...formData, store: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar a loja" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store} value={store}>
                        {store}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor *</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                  placeholder="Nome do fornecedor"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplierDocument">CNPJ do fornecedor *</Label>
                <Input
                  id="supplierDocument"
                  value={formData.supplierDocument}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      supplierDocument: e.target.value,
                    })
                  }
                  placeholder="CPF / CNPJ"
                  required
                />
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
              {formData.products.map((product, index) => (
                <ProductInput
                  key={index}
                  product={product}
                  onUpdate={(field, value) =>
                    updateProduct(index, field, value)
                  }
                  onRemove={() => removeProduct(index)}
                  canRemove={formData.products.length > 1}
                />
              ))}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
              />
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Anexar arquivos</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                files={formData.files}
                onFilesChange={(files) => setFormData({ ...formData, files })}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Enviar solicitação</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
