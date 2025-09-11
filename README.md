### Painel de Gerenciamento de Garantias e Divergências - Versão 1.0

* Criação da estrutura de pastas e arquivos do projeto.
* Implementação das funcionalidades
  de [Login e autenticação de usuários, criação de tickets de garantia e divergências, envio de arquivos, envio de mensagens nos tickets, atualização de status dos tickets].
* Desenvolvimento dos módulos de [Garantia e Divergência.].
* Configuração inicial do banco de dados com as tabelas principais.

### Como testar?

**1. Executar o backend do projeto:**

* Para rodar o backend, faça a verificação de como executa-lo dentro do readme.md no repositorio do projeto.
  [Link do repositório do projeto](https://github.com/oswaldomauricio/API_PAINEL_ADMINISTRATIVO_SPRING_BOOT)

* Após o projeto estar rodando, ja estará preparado para usar o frontend.

**2. Clonar o repositorio e modificar o ./env**

* Abra o arquivo `.env` e preencha as variáveis de ambiente com os dados.

```env
BASE_URL=                     (url base do front-end, ex: http://localhost:3000)
NEXTAUTH_URL=                 (url base do front-end, ex: http://localhost:3000)

HOME_PATHNAME=/dashboards/analytics

NEXTAUTH_SECRET=              (secret aleatório para o NextAuth, ex: uma string longa e complexa)
NEXT_PUBLIC_API_URL=          (url base do backend, ex: http://localhost:8081)

PORT=3000                      (porta onde o front-end irá rodar, ex: 3000)
```

**3. Baixar e Compilar o Projeto:**

* Clone o repositório:
    ```bash
    git clone https://github.com/oswaldomauricio/PAINEL_ADMINISTRATIVO_FRONTEND_NEXTJS.git
    cd [PASTA_DO_PROJETO]
    ```
* Use o npm ou yarn para instalar as dependências:
    ```bash
    npm install ou yarn install
    ```

**4. Executar a Aplicação:**

* Inicie o projeto com o comando:
    ```bash
    npm run build
    ```

    ```bash
    npm run start
    ```
  
* Acesse a aplicação no navegador através do endereço `http://localhost:3000` (ou a porta que você configurou).

#### Usando o docker

* Certifique-se de ter o Docker instalado e em execução na sua máquina.

* No terminal, navegue até o diretório raiz do projeto onde está localizado o arquivo `Dockerfile`.
* Execute o comando abaixo para construir a imagem Docker e iniciar o contêiner:
    ```bash
    docker build -t painel-administrativo-frontend .
    docker run -d -p 3000:3000 --name painel-administrativo painel-administrativo-frontend
    ```

* ou use o docker-compose:
    ```bash
    docker-compose up -d --build
    ```
  
