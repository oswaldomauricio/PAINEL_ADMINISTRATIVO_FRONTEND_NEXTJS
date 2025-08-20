export interface ProductDivergence {
  productCode: string
  quantity: number
  value: number
  type?: "FALTA" | "SOBRA" | "AVARIA" | "OUTRO"
  entryNote?: number
}

export interface divergenciasType {
  id: string
  store: string // loja
  supplier: string // fornecedor
  requestDate: Date // data
  supplierDocument: string //cnpj do fornecedor
  openDays: number // dias restantes
  status: "NOVO" | "PENDENTE" | "RESOLVIDO" | "CANCELADO" // status
  produtos: ProductDivergence[]
  description: string // descrição
}

export interface ProductWarranty {
  productCode: string
  quantity: number
  value: number
}

export interface garantiasType {
  id: string
  store: string // loja
  requestDate: Date // data
  openDays: number // dias restantes
  supplier: string // fornecedor
  salesNote: string // nota fiscal de venda
  customerName: string
  customerDocument: string
  status: "NOVO" | "PENDENTE" | "RESOLVIDO" | "CANCELADO" // status
  produtos: ProductWarranty[]
  description: string // descrição
}
