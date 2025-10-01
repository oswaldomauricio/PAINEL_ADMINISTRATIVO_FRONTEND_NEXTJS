import {
  CheckCircle,
  ClipboardList,
  Loader,
  Package,
  XCircle,
} from "lucide-react"

import type { estatisticasTickets } from "@/types/types"

export default function CardsEstatisticas(stats: estatisticasTickets) {
  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      <div className="bg-white shadow rounded-2xl p-4 flex flex-col items-center">
        <ClipboardList className="h-6 w-6 text-gray-700 mb-2" />
        <p className="text-sm font-medium text-gray-500">Total de Tickets</p>
        <p className="text-2xl font-bold text-gray-800">{stats.totalTickets}</p>
      </div>
      <div className="bg-white shadow rounded-2xl p-4 flex flex-col items-center">
        <Package className="h-6 w-6 text-blue-600 mb-2" />
        <p className="text-sm font-medium text-gray-500">Abertos</p>
        <p className="text-2xl font-bold text-blue-600">
          {stats.ticketsAbertos}
        </p>
      </div>
      <div className="bg-white shadow rounded-2xl p-4 flex flex-col items-center">
        <Loader className="h-6 w-6 text-yellow-500 mb-2" />
        <p className="text-sm font-medium text-gray-500">Em Andamento</p>
        <p className="text-2xl font-bold text-yellow-500">
          {stats.ticketsEmAndamento}
        </p>
      </div>
      <div className="bg-white shadow rounded-2xl p-4 flex flex-col items-center">
        <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
        <p className="text-sm font-medium text-gray-500">Concluídos</p>
        <p className="text-2xl font-bold text-green-600">
          {stats.ticketsConcluidos}
        </p>
      </div>
      <div className="bg-white shadow rounded-2xl p-4 flex flex-col items-center">
        <XCircle className="h-6 w-6 text-red-600 mb-2" />
        <p className="text-sm font-medium text-gray-500">Cancelados</p>
        <p className="text-2xl font-bold text-red-600">
          {stats.ticketsCancelados}
        </p>
      </div>
    </div>
  )
}
