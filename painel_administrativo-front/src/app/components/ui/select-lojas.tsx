import { useEffect, useState } from "react"
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

export default function SelectLojas() {
  const session = useSession()
  const id_usuario = session.data?.user.id

  const { apiCall } = useApi()
  const { store, setStore } = useStore()

  const [stores, setStores] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true)
      try {
        const response = await apiCall(`/v1/lojas/${id_usuario}`, {
          method: "GET",
        })

        if (response && Array.isArray(response)) {
          setStores(response.map((item) => item.loja))
        }
      } catch (error) {
        console.error("Erro ao buscar lojas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [apiCall, id_usuario])

  useEffect(() => {
    if (stores.length > 0 && store === null) {
      setStore(stores[0])
    }
  }, [stores, store, setStore])

  return (
    <div className="space-y-4">
      <Label htmlFor="store">Loja *</Label>
      <Select
        value={store !== null ? store.toString() : ""}
        onValueChange={(value) => {
          if (value) {
            console.log(value) //aqui no console ta ok, passa o valor certo.
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
