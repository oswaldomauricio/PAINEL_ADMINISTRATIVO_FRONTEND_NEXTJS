"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import type React from "react"

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
import { ProductInput } from "@/app/components//product-input"
import { RichTextEditor } from "@/app/components//rich-text-editor"
import { FileUpload } from "@/app/components/file-upload"

interface NewRequestModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void
}

const stores = ["Store A", "Store B", "Store C", "Store D"]
const suppliers = ["Supplier XYZ", "Supplier ABC", "Supplier DEF"]

export function NewRequestModal({
  isOpen,
  onClose,
  onSubmit,
}: NewRequestModalProps) {
  const [formData, setFormData] = useState({
    store: "",
    supplier: "",
    salesNote: "",
    requestDate: "",
    customerName: "",
    customerDocument: "",
    description: "",
    products: [{ code: "", quantity: "", value: "" }],
    files: [] as File[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    // Reset form
    setFormData({
      store: "",
      supplier: "",
      salesNote: "",
      requestDate: "",
      customerName: "",
      customerDocument: "",
      description: "",
      products: [{ code: "", quantity: "", value: "" }],
      files: [],
    })
  }

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { code: "", quantity: "", value: "" }],
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
        <DialogHeader>
          <DialogTitle>New Warranty Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store">Store *</Label>
                <Select
                  value={formData.store}
                  onValueChange={(value) =>
                    setFormData({ ...formData, store: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select store" />
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
                <Label htmlFor="supplier">Supplier *</Label>
                <Select
                  value={formData.supplier}
                  onValueChange={(value) =>
                    setFormData({ ...formData, supplier: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salesNote">Sales Note *</Label>
                <Input
                  id="salesNote"
                  value={formData.salesNote}
                  onChange={(e) =>
                    setFormData({ ...formData, salesNote: e.target.value })
                  }
                  placeholder="Enter sales note"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestDate">Request Date *</Label>
                <Input
                  id="requestDate"
                  type="date"
                  value={formData.requestDate}
                  onChange={(e) =>
                    setFormData({ ...formData, requestDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerDocument">Customer CPF/CNPJ *</Label>
                <Input
                  id="customerDocument"
                  value={formData.customerDocument}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customerDocument: e.target.value,
                    })
                  }
                  placeholder="Enter CPF or CNPJ"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Products
                <Button
                  type="button"
                  onClick={addProduct}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
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
              <CardTitle className="text-lg">Description</CardTitle>
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
              <CardTitle className="text-lg">Attachments</CardTitle>
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
              Cancel
            </Button>
            <Button type="submit">Create Request</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
