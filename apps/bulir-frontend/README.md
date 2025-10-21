🚀 Bulir Services - Frontend

Este é o projeto frontend desenvolvido para o Desafio 2 - Frontend Bulir, uma aplicação para contratação de prestadores de serviços, focada em segurança, gestão de estado global e transações financeiras atômicas.

🌟 Visão Geral do Projeto

A aplicação é construída com Next.js 14 (App Router) e TypeScript e consome a API RESTful desenvolvida na fase anterior do desafio (hospedada em Render). O foco principal está na implementação de um fluxo seguro de autenticação e autorização, juntamente com a funcionalidade crítica de transação atômica para contratação de serviços.

🛠️ Tecnologias Utilizadas

Categoria	Tecnologia	Justificativa
Framework	Next.js (v14+)	Alto desempenho, Server Components, e roteamento baseado em arquivos (App Router).
Linguagem	TypeScript	Segurança de tipo e escalabilidade, atendendo ao requisito.
Estilização	Tailwind CSS	Desenvolvimento rápido e altamente customizável.
Estado Global	React Context API	Gerenciamento de estado de autenticação (AuthContext) e dados de usuário (saldo, role).
Comunicação API	Axios	Cliente HTTP robusto com interceptores para injeção automática de JWT.
Autenticação	js-cookie	Persistência segura do token JWT no lado do cliente (via cookies).

✨ Funcionalidades Implementadas

O projeto atende a todos os requisitos funcionais e de segurança do desafio:

1. Autenticação e Autorização

    Login & Registro: Telas funcionais para autenticação de Clientes e Providers.

    Persistência Segura: O token JWT é armazenado em Cookies e gerenciado pelo AuthContext.

    Proteção de Rotas (middleware.ts): Redireciona usuários não autenticados e implementa verificação de permissões por Role antes do acesso à rota.

    Proteção de Componente (RoleGuard.tsx): Garante que componentes sensíveis (Ex: Gerir Serviço) só sejam exibidos para o PROVIDER.

2. Fluxo do Cliente (CLIENT)

    Listagem de Serviços: Clientes podem visualizar todos os serviços disponíveis na Home (/).

    Adicionar Fundos (Depósito): Implementado um formulário de depósito que atualiza o saldo do cliente e o estado global (AuthContext).

    Contratação de Serviço: Funcionalidade de compra integrada.

        Validação de Saldo: O botão Contratar é desabilitado se o saldo do cliente for insuficiente.

        Transação Atômica: O endpoint de contratação dispara a transação de débito/crédito no backend, e o frontend atualiza o saldo imediatamente.

3. Fluxo do Prestador (PROVIDER)

    Gerenciamento de Serviços (CRUD): Implementação completa da criação, visualização, edição e exclusão de serviços (Acesso restrito à rota /manage).

4. Histórico de Transações

    Página Histórico (/history): Usuários autenticados (CLIENT e PROVIDER) podem visualizar uma lista detalhada de todas as transações que os envolveram, mostrando o valor, o tipo (Crédito/Débito) e os detalhes.

🛠️ Como Rodar Localmente

Siga estes passos para configurar e executar o projeto no seu ambiente de desenvolvimento:

1. Pré-requisitos

    Node.js (v18+)

    npm ou yarn

    A API do backend deve estar rodando e acessível.

2. Instalação

Clone o repositório e instale as dependências:
Bash

git clone <URL-DO-SEU-REPOSITORIO>
cd bulir-frontend
npm install
# ou yarn install

3. Variáveis de Ambiente

Crie um arquivo .env.local na raiz do projeto e configure a URL da sua API hospedada:

# .env.local

# URL do seu backend NestJS hospedado (Ex: Render, Vercel, etc.)
NEXT_PUBLIC_API_URL="https://bulir-challenges.onrender.com"

4. Execução

Inicie o servidor de desenvolvimento do Next.js:
Bash

npm run dev
# ou yarn dev

A aplicação estará acessível em: http://localhost:3000

💻 Estrutura de Pastas (Base)

Caminho	Descrição
app/	Roteamento principal do Next.js (App Router). Contém /login, /register, /manage, /history.
src/context/AuthContext.tsx	Núcleo do gerenciamento de estado global de autenticação, saldo e JWT.
src/services/api.ts	Configuração do Axios e do interceptor para o JWT.
src/services/user.service.ts	Serviços de API relacionados ao usuário (Ex: addFunds).
src/services/service.service.ts	Serviços de API relacionados a serviços (Ex: listAllServices, contractService, CRUD).
src/components/Header.tsx	Navbar global, exibição de saldo e botão de Logout.
src/components/RoleGuard.tsx	Componente de proteção de conteúdo baseado na role do usuário.
middleware.ts	Arquivo para proteção de rotas no Next.js (Server-side).
