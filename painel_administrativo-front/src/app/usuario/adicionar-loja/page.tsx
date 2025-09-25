"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserServices } from "@/app/service/UserServices"
import { LojasService } from "@/app/service/lojasService"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Store,
  User,
  UserPlus,
} from "lucide-react"

import type { Roles } from "@/types/roles"
import type { LojasCadastradas, usuariosCadastrados } from "@/types/types"

import { hasPermission } from "@/lib/permissions"

import { useApi } from "@/hooks/use-api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type FormData = {
  id: string // usuário selecionado
  loja: string // loja selecionada
}

const userServices = new UserServices()
const lojaServices = new LojasService()

export default function AdicionarLojaAoUsuario() {
  const router = useRouter()
  const { user, apiCall } = useApi()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<LojasCadastradas | null>(null)
  const [users, setUsers] = useState<usuariosCadastrados[]>([])
  const [lojas, setLojas] = useState<LojasCadastradas[]>([])

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  useEffect(() => {
    if (!user || !hasPermission(user.role as Roles, "create:usuario")) {
      router.push("/dashboard")
      return
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const usuariosResponse =
          await userServices.listarTodasOsUsuariosCadastradas(apiCall)
        const lojasResponse =
          await lojaServices.listarTodasAsLojasCadastradas(apiCall)
        setUsers(usuariosResponse)
        setLojas(lojasResponse)
      } catch (err) {
        console.error(err)
        setError("Erro ao carregar dados de usuários ou lojas.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, router, apiCall])

  const selectedUserId = watch("id")
  const selectedStoreId = watch("loja")

  const onSubmit = async () => {
    setIsLoading(true)
    setError("")
    setSuccess(null)

    const selectedUser = users.find((u) => u.id === Number(selectedUserId))
    const selectedStore = lojas.find((s) => s.loja === Number(selectedStoreId))

    try {
      if (!selectedUser || !selectedStore) {
        throw new Error("Usuário ou loja não selecionados")
      }

      const result = await lojaServices.atribuirLojaParaUsuario(apiCall, {
        idUser: selectedUser.id,
        loja: selectedStore.loja,
      })

      console.log("loja atribuida com sucesso", result.loja)

      toast.success("Loja atribuída com sucesso!")
      setSuccess(selectedStore)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.message.includes("400")) {
        toast.error(
          `O usuário já está cadastrado na loja: ${selectedStore?.loja}`
        )
        setError(`O usuário já está cadastrado na loja: ${selectedStore?.loja}`)
      } else {
        toast.error("Erro ao atribuir loja ao usuário")
      }
      console.error("Erro no onSubmit:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignAnother = () => {
    setSuccess(null)
    setError("")
    reset()
  }

  const selectedUser = users.find((u) => u.id === Number(selectedUserId))
  const selectedStore = lojas.find((s) => s.loja === Number(selectedStoreId))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex justify-between gap-4 flex-row">
            <div>
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-red-500" />
                <h1 className="text-3xl font-bold flex items-center gap-4">
                  Adicionar Lojas aos Usuários
                </h1>
              </div>
              <p className="text-lg font-semibold py-1">
                Adicione as lojas aos usuários existentes no sistema.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>

        {success && (
          <Card className="border-green-200 bg-green-50 p-4">
            <CardContent className="">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-green-900">
                    Loja atribuída com sucesso!
                  </h3>
                  <div className="mt-2 text-sm text-green-700 space-y-1">
                    <p>
                      <strong>Usuário:</strong> {selectedUser?.login}
                    </p>
                    <p>
                      <strong>Loja:</strong> {success.nomeLoja}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button onClick={handleAssignAnother} size="sm">
                      Atribuir Outra Loja
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/dashboard")}
                      size="sm"
                    >
                      Voltar ao Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!success && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Adicionar Loja
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="">
                {/* User Selection */}
                <div className="p-4">
                  <Label htmlFor="id">Usuário *</Label>
                  <Select
                    value={selectedUserId}
                    onValueChange={(value) => setValue("id", value)}
                    required
                  >
                    <SelectTrigger
                      className={errors.id ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Selecione um usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="font-medium">{user.login}</p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.id && (
                    <p className="text-sm text-red-600">
                      {errors.id.message as string}
                    </p>
                  )}
                </div>

                {/* Store Selection */}
                <div className="p-4">
                  <Label htmlFor="loja">Loja *</Label>
                  <Select
                    value={selectedStoreId}
                    onValueChange={(value) => setValue("loja", value)}
                    required
                  >
                    <SelectTrigger
                      className={errors.loja ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Selecione uma loja" />
                    </SelectTrigger>
                    <SelectContent>
                      {lojas.map((store) => (
                        <SelectItem
                          key={store.loja}
                          value={store.loja.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="font-medium">
                                {store.loja} - {store.nomeLoja}
                              </p>
                              <p className="text-xs text-gray-500">
                                {store.cidade} - {store.sigla}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.loja && (
                    <p className="text-sm text-red-600">
                      {errors.loja.message as string}
                    </p>
                  )}
                </div>

                {/* Preview Selection */}
                {selectedUser && selectedStore && (
                  <Card className="bg-gray-50 border-gray-200 p-4 m-4">
                    <CardContent className="">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Resumo da Atribuição:
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="text-gray-600">Usuário:</span>
                          <span className="font-medium">
                            {selectedUser.login}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-green-600" />
                          <span className="text-gray-600">Loja:</span>
                          <span className="font-medium">
                            {selectedStore.nomeLoja} ({selectedStore.loja})
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          <strong>Endereço:</strong> {selectedStore.endereco}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive" className="m-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <div className="flex flex-col gap-3 m-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading || !selectedUserId || !selectedStoreId}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Atribuindo loja...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        Atribuir Loja
                      </div>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/")}
                    disabled={isLoading}
                    className="flex items-center gap-2 hover:bg-red-100"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200 p-4">
          <CardContent className="pt-4">
            <div className="text-sm text-blue-800">
              <h4 className="font-medium mb-2">Informações importantes:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  Apenas administradores podem atribuir lojas aos usuários
                </li>
                <li>Um usuário pode estar associado a múltiplas lojas</li>
                <li>
                  A atribuição permite acesso específico aos dados da loja
                </li>
                <li>
                  Usuários só verão tickets das lojas às quais estão associados
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Usuários e Lojas Cadastradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Usuários ({users.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded"
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{user.login}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Lojas ({lojas.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {lojas.map((store) => (
                    <div
                      key={store.loja}
                      className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded"
                    >
                      <Store className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">
                          {store.loja} - {store.nomeLoja}
                        </p>
                        <p className="text-xs text-gray-500">
                          {store.sigla} - {store.cidade}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
