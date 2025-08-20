"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSession, signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginFormData {
  login: string
  password: string
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        login: data.login,
        senha: data.password,
        redirect: false,
      })

      if (result?.error) {
        // Diferentes tipos de erro baseados na resposta da API
        if (result.error === "CredentialsSignin") {
          setError("Credenciais inválidas. Verifique seu login e senha.")
        } else {
          setError("Erro ao fazer login. Tente novamente.")
        }
      } else if (result?.ok) {
        // Verificar se a sessão foi criada com sucesso
        const session = await getSession()
        if (session) {
          console.log("Login realizado com sucesso:", {
            nome: session.user?.name,
            role: session.user.role,
            id: session.user.id,
          })
          router.push("/dashboard")
        }
        console.log("sessao" + session)
      }
    } catch (err) {
      console.error("Erro no processo de login:", err)
      setError("Erro interno do servidor. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Login
          </CardTitle>
          <p className="text-gray-600 mt-2">Acesse o sistema de garantias</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Login Field */}
            <div className="space-y-2">
              <Label htmlFor="login">Login</Label>
              <Input
                id="login"
                type="text"
                placeholder="Digite seu login"
                {...register("login", {
                  required: "Login é obrigatório",
                  minLength: {
                    value: 3,
                    message: "Login deve ter pelo menos 3 caracteres",
                  },
                })}
                className={errors.login ? "border-red-500" : ""}
              />
              {errors.login && (
                <p className="text-sm text-red-600">{errors.login.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  {...register("password", {
                    required: "Senha é obrigatória",
                    minLength: {
                      value: 6,
                      message: "Senha deve ter pelo menos 6 caracteres",
                    },
                  })}
                  className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
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
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Entrar
                </div>
              )}
            </Button>
          </form>

          {/* Debug info - remover em produção */}
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
            <p>
              <strong>Para teste:</strong>
            </p>
            <p>Use as credenciais válidas da sua API</p>
            <p>Em caso de erro 403, verifique login/senha</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
