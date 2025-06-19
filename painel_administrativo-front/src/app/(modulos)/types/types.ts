export interface divergenciasType {
  id: string
  store: string // loja
  date: Date // data
  days_remaining: number // dias restantes
  supplier: string // fornecedor
  salesNote: string // nota fiscal de venda
  status: "Pendente" | "Aprovada" | "Rejeitada" // status
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
