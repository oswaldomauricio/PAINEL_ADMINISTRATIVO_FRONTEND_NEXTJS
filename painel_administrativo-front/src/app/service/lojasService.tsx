type ApiCallFunction = (url: string, options: RequestInit) => Promise<unknown>

export class LojasService {
  /**
   * Busca e retorna a lista de lojas de um usuário.
   * @param apiCall - A função que executa a chamada à API.
   * @param id_usuario - O ID do usuário para buscar as lojas.
   * @returns Uma promessa que resolve para um array de números de loja.
   */
  async listarLojas(
    apiCall: ApiCallFunction, // Recebe a função como primeiro argumento
    id_usuario: string | number
  ): Promise<number[]> {
    if (!id_usuario) {
      console.warn("ID do usuário não fornecido para listarLojas.")
      return []
    }

    try {
      const response = await apiCall(`/v1/lojas/${id_usuario}`, {
        method: "GET",
      })

      if (response && Array.isArray(response)) {
        return response.map((item) => item.loja)
      }

      return []
    } catch (error) {
      console.error("Erro ao buscar lojas no serviço:", error)
      throw error
    }
  }
}
