"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserServices } from "@/app/service/UserServices"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  User,
  UserPlus,
} from "lucide-react"

import type { Roles } from "@/types/roles"

import { hasPermission } from "@/lib/permissions"

import { useApi } from "@/hooks/use-api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const userServices = new UserServices()

export interface CreateUserFormData {
  login: string
  senha: string
  confirmPassword: string
}

export interface CreateUserResponse {
  id: number
  login: string
  role: string
}

export default function RegistrarUsuarioPage() {
  const router = useRouter()
  const { user, apiCall } = useApi()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<CreateUserResponse | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CreateUserFormData>()

  useEffect(() => {
    if (!user || !hasPermission(user.role as Roles, "create:usuario")) {
      router.push("/dashboard")
    }
  }, [user, router])

  const password = watch("senha")

  const onSubmit = async (data: CreateUserFormData) => {
    setIsLoading(true)
    setError("")
    setSuccess(null)

    try {
      const result = await userServices.criarUsuario(apiCall, data)

      if (result) {
        setSuccess(result)
        toast.success("Usuário criado com sucesso!")
      }
    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err)
      setError("Falha ao criar usuário")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAnother = () => {
    setSuccess(null)
    setError("")
    reset()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex justify-between gap-4 flex-row">
            <div>
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-red-500" />
                <h1 className="text-3xl font-bold flex items-center gap-4">
                  Criar Usuário
                </h1>
              </div>
              <p className="text-lg font-semibold py-1">
                Adicione um novo usuário ao sistema
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
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-green-900">
                    Usuário criado com sucesso!
                  </h3>
                  <div className="mt-2 text-sm text-green-700 space-y-1">
                    <p>
                      <strong>ID:</strong> {success.id}
                    </p>
                    <p>
                      <strong>Login:</strong> {success.login}
                    </p>
                    <p>
                      <strong>Regra:</strong> {success.role}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button onClick={handleCreateAnother} size="sm">
                      Criar Outro Usuário
                    </Button>
                    <Button
                      onClick={() => router.push("/usuario/adicionar-loja")}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Adicionar Loja a Usuários
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
                Novo Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-2 px-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login">Login *</Label>
                  <Input
                    id="login"
                    type="text"
                    placeholder="Digite o login do usuário"
                    {...register("login", {
                      required: "Login é obrigatório",
                      minLength: {
                        value: 3,
                        message: "Login deve ter pelo menos 3 caracteres",
                      },
                      maxLength: {
                        value: 50,
                        message: "Login deve ter no máximo 50 caracteres",
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_.-]+$/,
                        message:
                          "Login deve conter apenas letras, números, pontos, hífens e underscores",
                      },
                    })}
                    className={errors.login ? "border-red-500" : ""}
                  />
                  {errors.login && (
                    <p className="text-sm text-red-600">
                      {errors.login.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite a senha"
                      {...register("senha", {
                        required: "Senha é obrigatória",
                        minLength: {
                          value: 6,
                          message: "Senha deve ter pelo menos 6 caracteres",
                        },
                        maxLength: {
                          value: 100,
                          message: "Senha deve ter no máximo 100 caracteres",
                        },
                      })}
                      className={`pr-10 ${errors.senha ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.senha && (
                    <p className="text-sm text-red-600">
                      {errors.senha.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme a senha"
                      {...register("confirmPassword", {
                        required: "Confirmação de senha é obrigatória",
                        validate: (value) =>
                          value === password || "As senhas não coincidem",
                      })}
                      className={`pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3 py-4 flex-col ">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Criando usuário...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Criar Usuário
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="bg-blue-50 border-blue-200 p-6">
          <CardContent className="pt-4">
            <div className="text-sm text-blue-800">
              <h4 className="font-medium mb-2">Informações importantes:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Apenas administradores podem criar novos usuários</li>
                <li>O login deve ser único no sistema</li>
                <li>A senha deve ter pelo menos 6 caracteres</li>
                <li>
                  Novos usuários são criados com role regra de USER por padrão.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
