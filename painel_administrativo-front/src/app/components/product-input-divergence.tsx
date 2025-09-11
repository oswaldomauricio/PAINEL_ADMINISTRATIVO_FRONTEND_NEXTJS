"use client"

import { Trash2 } from "lucide-react"

import type { ProductDivergence } from "../dashboard/types/types"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"

interface ProductInputProps {
  product: {
    codigo_produto: string
    quantidade: number
    tipo_divergencia: "FALTA" | "SOBRA" | "AVARIA" | "OUTROS" | ""
  }
  onUpdate: (field: keyof ProductDivergence, value: string | number) => void
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
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-gray-50">
      <div className="space-y-2">
        <Label htmlFor="productCode">Codigo do produto</Label>
        <Input
          id="productCode"
          value={product.codigo_produto}
          onChange={(e) => onUpdate("codigo_produto", e.target.value)}
          placeholder="Digite o codigo..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantidade</Label>
        <Input
          id="quantity"
          type="number"
          value={product.quantidade}
          onChange={(e) => onUpdate("quantidade", Number(e.target.value))}
          placeholder="Quantidade..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo-divergencia">Tipo de divergência</Label>
        <select
          id="type"
          value={product.tipo_divergencia}
          onChange={(e) => onUpdate("tipo_divergencia", e.target.value)}
          className="border rounded px-3 py-2 w-full bg-white text-neutral-500 text-sm"
          required
        >
          <option value="">Selecione...</option>
          <option value="SOBRA">SOBRA</option>
          <option value="FALTA">FALTA</option>
          <option value="AVARIA">AVARIA</option>
          <option value="OUTROS">OUTROS</option>
        </select>
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
