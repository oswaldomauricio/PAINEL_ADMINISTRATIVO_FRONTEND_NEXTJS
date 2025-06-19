"use client"

import { Trash2 } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"

interface ProductInputProps {
  product: {
    code: string
    quantity: string
    value: string
  }
  onUpdate: (field: string, value: string) => void
  onRemove: () => void
  canRemove: boolean
}

export function ProductInput({
  product,
  onUpdate,
  onRemove,
  canRemove,
}: ProductInputProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
      <div className="space-y-2">
        <Label htmlFor="productCode">Código do produto</Label>
        <Input
          id="productCode"
          value={product.code}
          onChange={(e) => onUpdate("code", e.target.value)}
          placeholder="Enter product code"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantidade</Label>
        <Input
          id="quantity"
          type="number"
          value={product.quantity}
          onChange={(e) => onUpdate("quantity", e.target.value)}
          placeholder="Enter quantity"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Valor do produto</Label>
        <Input
          id="value"
          type="number"
          step="0.01"
          value={product.value}
          onChange={(e) => onUpdate("value", e.target.value)}
          placeholder="Enter value"
        />
      </div>

      <div className="flex items-end">
        {canRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
