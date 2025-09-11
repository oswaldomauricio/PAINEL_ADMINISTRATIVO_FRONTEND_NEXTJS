import { useEffect, useState } from "react"
import { LojasService } from "@/app/service/lojasService"
import { useSession } from "next-auth/react"

import { useApi } from "@/hooks/use-api"
import { useStore } from "@/contexts/lojaContext"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectType {
  title: string
}

const lojasService = new LojasService()

export default function SelectLojas({ title }: SelectType) {
  const session = useSession()
  const id_usuario = session.data?.user.id

  const { apiCall } = useApi()
  const { store, setStore } = useStore()

  const [stores, setStores] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id_usuario) {
      setLoading(false)
      return
    }

    const fetchStores = async () => {
      setLoading(true)
      try {
        const storesData = await lojasService.listarLojas(apiCall, id_usuario)
        setStores(storesData)
      } catch (error) {
        console.error("Erro ao buscar lojas no componente:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [apiCall, id_usuario]) // As dependências continuam as mesmas

  useEffect(() => {
    if (stores.length > 0 && store === null) {
      setStore(stores[0])
    }
  }, [stores, store, setStore])

  return (
    <div className="space-y-4">
      {title && <Label htmlFor="store">{title}</Label>}
      <Select
        value={store !== null ? store.toString() : ""}
        onValueChange={(value) => {
          if (value) {
            console.log(value)
            setStore(Number(value))
          }
        }}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={loading ? "Carregando..." : "Selecionar a loja"}
          />
        </SelectTrigger>
        <SelectContent>
          {stores.length > 0
            ? stores.map((storeId) => (
                <SelectItem key={storeId} value={storeId.toString()}>
                  Loja {storeId}
                </SelectItem>
              ))
            : !loading && (
                <SelectItem value="none" disabled>
                  Nenhuma loja encontrada
                </SelectItem>
              )}
        </SelectContent>
      </Select>
    </div>
  )
}
