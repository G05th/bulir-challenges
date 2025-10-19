🚀 bulir Backend

Este é o repositório backend da aplicação API de reservas, autenticação e seed para testes.. Construído com NestJS, ele utiliza uma arquitetura baseada em módulos, garantindo alta coesão e baixo acoplamento.

🌟 Visão Geral da Arquitetura

O projeto adota uma arquitetura limpa e orientada a transações, focada em segurança (JWT, Guards) e integridade financeira (Transações Atômicas).

Módulos Principais

Módulo	Responsabilidade	Destaque Arquitetural
Auth	Autenticação, Cadastro (CLIENT / PROVIDER) e Geração de JWT.	Implementa JwtStrategy e RolesGuard para autorização baseada em papéis.
Prisma	Camada de Acesso ao Banco de Dados (ORM).	Utiliza o PrismaService como Provider global e gerencia as migrações.
Reservation	Gestão de Agendamentos e Finanças.	Núcleo de Integridade: Todas as operações (Reserva e Cancelamento) são executadas via $transaction do Prisma para garantir a atomicidade (débito/crédito simultâneo).
Services	CRUD dos serviços oferecidos pelos Prestadores.	Segurança em Nível 2: Verifica a posse (providerId) antes de permitir a atualização ou exclusão.
User	Gestão de perfis e saldos.	Inclui lógica para leitura e atualização do saldo (usado nas transações).

Padrões de Segurança Implementados

    Guards & Roles: Utilização de AuthGuard('jwt') em combinação com o RolesGuard e o decorator @Roles() para restringir o acesso a rotas específicas por papel (CLIENT ou PROVIDER).

    Transações Atômicas: O módulo Reservation utiliza transações de banco de dados para garantir que o débito da conta de um usuário e o crédito na conta de outro ocorram juntos ou falhem juntos (princípio ACID).

    Integridade de Dados: O sistema impede a exclusão de Serviços que possuam Reservas com status ACTIVE (lançando um 409 Conflict).

🛠️ Requisitos e Instalação

Requisitos de Desenvolvimento

    Node.js (versão LTS recomendada)

    npm ou Yarn

    [Docker] (Opcional, para banco de dados em produção)

1. Clonagem e Configuração

Bash

# Clone o repositório
git clone https://github.com/G05th/bulir-challenges.git
cd bulir-challenges/apps/backend

# Instale as dependências
npm install

2. Configuração de Variáveis de Ambiente

Crie um arquivo chamado .env na raiz do projeto e preencha as variáveis de ambiente necessárias:
Ini, TOML

PORT=3000
NODE_ENV=development

# JWT CONFIG
JWT_SECRET=sua_chave_secreta_muito_forte_e_aleatoria_aqui
JWT_EXPIRES_IN=60m

# PRISMA/DB CONFIG
# Usando SQLite para desenvolvimento
DATABASE_URL="file:./dev.db" 
# Para PostgreSQL, use: DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"

3. Configuração do Banco de Dados (Prisma)

Crie o arquivo do banco de dados e execute a primeira migração:
Bash

# Cria o arquivo dev.db e aplica o schema do Prisma
npx prisma migrate dev --name init

▶️ Executando a Aplicação

Modo Desenvolvimento (Hot Reload)

Bash

npm run start:dev

A aplicação estará acessível em http://localhost:3000.

Modo Produção

Bash

npm run build
npm run start

🧪 Rotas e Endpoints Principais

A documentação completa das rotas (DTOs, schemas) pode ser obtida via Swagger (se implementado) ou nos arquivos *.controller.ts.
Módulo	Método	Rota	Descrição	Papéis Autorizados
Auth	POST	/auth/register	Cria Cliente ou Prestador.	Público
Auth	POST	/auth/login	Retorna o JWT.	Público
Services	GET	/services	Lista todos os serviços.	Público
Services	POST	/services	Cria um novo serviço.	PROVIDER
Services	DELETE	/services/:id	Exclui um serviço (Verifica Posse e Reservas Ativas).	PROVIDER
Reservations	POST	/reservations	Cria uma nova reserva (Transação Atômica).	CLIENT
Reservations	DELETE	/reservations/:id/cancel	Cancela e Estorna (Transação Atômica Reversa).	CLIENT, PROVIDER
