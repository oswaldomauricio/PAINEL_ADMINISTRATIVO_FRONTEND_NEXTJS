export interface Product {
  productCode: string
  quantity: number
  value: number
  type: "FALTA" | "SOBRA" | "AVARIA" | "OUTRO"
  entryNote: number
}

export interface divergenciasType {
  id: string
  store: string // loja
  supplier: string // fornecedor
  requestDate: Date // data
  supplierDocument: string //cnpj do fornecedor
  openDays: number // dias restantes
  status: "NOVO" | "PENDENTE" | "RESOLVIDO" | "CANCELADO" // status
  produtos: Product[]
  description: string // descrição
}

export interface garantiasType {
  id: string
  store: string // loja
  date: Date // data
  days_remaining: number // dias restantes
  supplier: string // fornecedor
  salesNote: string // nota fiscal de venda
  status: "Pendente" | "Aprovada" | "Rejeitada" // status
  description: string // descrição
}
