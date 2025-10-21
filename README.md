
-----

# 🌐 Plataforma Bulir Services: Sistema de Contratação de Prestadores

Este repositório conterá o código-fonte completo (Frontend e/ou Backend) desenvolvido para o **Desafio 1-2 - Plataforma Bulir Services**. O projeto implementa um ecossistema completo para a contratação de serviços, focado em segurança, arquitetura modular e transações financeiras atômicas.

## 🚀 Arquitetura do Sistema

O projeto segue uma arquitetura moderna baseada em serviços:

| Componente | Tecnologia Principal | Hospedagem | Função Central |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Next.js 14, TypeScript** | Local / Vercel | Interface do usuário, gestão de estado global de autenticação e proteção de rotas. |
| **Backend (API)** | **NestJS, TypeScript** | Render | Camada de dados, lógica de negócios, autenticação JWT, e gestão de transações atômicas. |
| **Banco de Dados** | **SQLite** | Render (ou Similar) | Persistência de dados de usuários, serviços e transações. |

## ✨ Requisitos do Desafio (Funcionalidades Implementadas)

O sistema atende a todos os requisitos funcionais e de validação do desafio:

### 1\. Núcleo de Segurança e Autenticação

  * **Autenticação JWT:** Login e Registro implementados com validação de credenciais. O token JWT é persistido nos **Cookies** para segurança e gerenciamento de estado.
  * **Autorização (Roles):** O sistema diferencia entre `CLIENT` e `PROVIDER` para acesso a funcionalidades e rotas específicas.
  * **Proteção de Rota (`Next.js Middleware`):** Todas as rotas sensíveis (`/manage`, `/history`) são protegidas contra acesso de usuários deslogados ou com `Role` incorreta.

### 2\. Contratação e Transações Atômicas

  * **Visibilidade de Serviços:** Clientes visualizam todos os serviços disponíveis na Home (`/`).
  * **Gestão de Saldo (Depósito):** Clientes podem adicionar fundos ao seu saldo, atualizando o estado global via API (`POST /users/funds`).
  * **Validação de Saldo:** O frontend desabilita a contratação se o cliente não tiver saldo suficiente.
  * **Transação Atômica:** A contratação (`POST /services/contract`) garante que:
    1.  O saldo do **CLIENTE** é deduzido.
    2.  O saldo do **PRESTADOR** é creditado.
    3.  A **Transação** é registada no histórico.
        *Tudo em uma única operação de base de dados para garantir consistência.*

### 3\. Gerenciamento de Serviços (`PROVIDER`)

  * **CRUD Completo:** Prestadores autenticados podem **criar**, **visualizar**, **editar** e **excluir** seus serviços através da rota `/manage`.

### 4\. Histórico de Transações

  * **Página Dedicada (`/history`):** Usuários logados (CLIENTs e PROVIDERs) podem visualizar um histórico detalhado de todas as transações em que estiveram envolvidos (mostrando Crédito/Débito, valor e data).

## 💻 Estrutura e Tecnologia do Frontend

O frontend é modular, utilizando o `Next.js App Router` para uma arquitetura eficiente:

  * **`src/context/AuthContext.tsx`**: O coração do frontend. Gerencia o estado de autenticação, JWT (lendo e escrevendo Cookies), e o saldo do usuário.
  * **`src/services/api.ts`**: Configura o Axios, implementa o interceptor para anexar o JWT automaticamente em todas as requisições autenticadas.
  * **`src/components/Header.tsx`**: Resolução do erro de **Hydration Mismatch** garantindo que a renderização condicional (Ex: Saldo, Link Gerir) só ocorra no cliente.
  * **`middleware.ts`**: Lógica de roteamento e segurança executada no lado do servidor.

## 🛠️ Como Configurar e Rodar

### 1\. Pré-requisitos

  * Node.js (v18+)
  * npm ou yarn
  * O Backend deve estar hospedado e acessível (Ex: `https://bulir-challenges.onrender.com`).

### 2\. Configuração do Frontend

1.  **Instalação:**
    ```bash
    npm install
    ```
2.  **Variável de Ambiente:** Crie o arquivo `.env.local` na raiz do frontend e defina a URL da API:
    ```
    NEXT_PUBLIC_API_URL="<URL_DA_SUA_API_HOSPEDADA>"
    ```
3.  **Execução:**
    ```bash
    npm run dev
    ```
    Acesse: `http://localhost:3000`

### 3\. Configuração do Backend (Para Referência)

  * **Configuração CORS:** O NestJS backend deve ter o CORS habilitado para aceitar requisições de `http://localhost:3000` (e da URL de produção do frontend) com `credentials: true`.
  * **Banco de Dados:** O servidor precisa de credenciais de banco de dados (PostgreSQL/Outro) configuradas no `.env` do backend para as operações de transação.

-----

**Desenvolvimento Por Concluir\!**
