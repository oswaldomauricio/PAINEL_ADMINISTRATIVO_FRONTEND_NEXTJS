export type Status =
  | "NOVO"
  | "PENDENTE"
  | "RESOLVIDO"
  | "REPROVADO"
  | "CANCELADO"
  | "CONCLUIDO"

export interface ProductDivergence {
  codigo_produto: string
  quantidade: number
  valor: number
  tipo?: "FALTA" | "SOBRA" | "AVARIA" | "OUTRO"
}

export interface divergenciasType {
  id: number
  loja: string
  data_solicitacao: Date
  data_atualizacao: Date
  dias_em_aberto: number
  usuario_cadastro: string
  fornecedor: string
  nota: string
  cpfCnpj: string
  status: Status[]
  produtos: ProductDivergence[]
  descricao: string
}

export interface ProductWarranty {
  codigo_produto: string
  quantidade: number
  valor_unitario: number
}

export interface garantiasType {
  id: number
  loja: string
  data_solicitacao: Date
  data_atualizacao: Date
  dias_em_aberto: number
  fornecedor: string
  nota_de_venda: string
  nome_cliente: string
  usuario_cadastro: string
  cpfCnpj: string
  status: Status[]
  produtos: ProductWarranty[]
  descricao: string
}

export type CriarGarantiaDTO = {
  nome_cliente: string
  loja: number
  fornecedor: string
  cpf_cnpj: string
  nota: string
  id_usuario: number
  produtos: ProductWarranty[]
  descricao: string
}

export interface attachments {
  id: number
  name: string
  size: number
  type: string
  uploadedBy: string
  uploadedAt: Date
}
