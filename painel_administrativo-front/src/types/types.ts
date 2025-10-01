import type { Roles } from "./roles"

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
  tipo_divergencia: "FALTA" | "SOBRA" | "AVARIA" | "OUTROS" | ""
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
  tipo_divergencia: "FALTA" | "SOBRA" | "AVARIA" | "OUTROS" | ""
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

export type CriarDivergenciaDTO = {
  loja: number
  fornecedor: string
  cpf_cnpj: string
  nota: string
  id_usuario: number
  produtos: ProductDivergence[]
  descricao: string
}

export interface attachments {
  id: number
  name: string
  size: number
  type: string
  uploadedBy: string
  uploadedAt: Date
  fileDownloadUri: string
}

export interface FileUpload {
  id?: number | undefined
  fileName: string
  fileDownloadUri: string
  fileType: string
  size: string
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface TicketPage {
  content: garantiasType[]
  totalElements: number
  totalPages: number
}

export interface TicketPageDivergencia {
  content: divergenciasType[]
  totalElements: number
  totalPages: number
}

export interface LojasCadastradas {
  loja: number
  nomeLoja: string | null
  endereco: string | null
  estado: string | null
  sigla: string | null
  cidade: string | null
  email: string | null
  latitude: number | null
  longitude: number | null
  segmentacao: string | null
  segmentacao2: string | null
  telefone: string | null
  whatsapp: string | null
  horario: string | null
}

export interface usuariosCadastrados {
  id: number
  login: string
  email: string
  role: Roles
}

export enum StatusTicketGarantia {
  NOVO,
  RECEBIDO,
  PENDENTE,
  EM_ANALISE,
  IMPROCEDENTE,
  TRANSPORTE,
  EMISSAO_DE_NOTA,
  RESSARCIMENTO,
  RESSARCIDO,
  CREDITO_RECEBIDO,
  CONCLUIDO,
  CANCELADO,
}

export enum StatusTicketDivergencia {
  NOVO,
  RECEBIDO,
  PENDENTE,
  EM_ANALISE,
  IMPROCEDENTE,
  TRANSPORTE,
  EMISSAO_DE_NOTA,
  RESSARCIMENTO,
  RESSARCIDO,
  CREDITO_RECEBIDO,
  CONCLUIDO,
  CANCELADO,
}

export interface estatisticasTickets {
  totalTickets: number
  ticketsAbertos: number
  ticketsEmAndamento: number
  ticketsConcluidos: number
  ticketsCancelados: number
}
