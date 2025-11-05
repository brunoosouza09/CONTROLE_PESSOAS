# Sistema de Cadastro de Pessoas

Sistema completo de cadastro de pessoas com autenticação, validações e deploy automatizado.

## 🚀 Funcionalidades

- ✅ Cadastro de pessoas com validações
- ✅ Listagem, edição e exclusão de registros
- ✅ Sistema de autenticação (login/logout)
- ✅ Validações frontend e backend (CPF, Email, Telefone, CEP)
- ✅ Proteção de rotas da API
- ✅ Interface responsiva e moderna
- ✅ Deploy automatizado via GitHub Actions

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- MySQL 8.0
- Git

## 🔧 Instalação

### Local

1. Clone o repositório:
```bash
git clone https://github.com/brunoosouza09/CONTROLE_PESSOAS.git
cd CONTROLE_PESSOAS
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (crie um arquivo `.env`):
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=cadastro_pessoas
SESSION_SECRET=sua-chave-secreta-super-segura
```

4. Execute as migrações:
```bash
npm run migrate
```

5. Crie o usuário admin:
```bash
npm run create-admin
```

6. Inicie o servidor:
```bash
npm start
```

### Docker

1. Clone o repositório e configure o `.env` (se necessário)

2. Execute:
```bash
docker compose up -d --build
```

3. Crie o usuário admin:
```bash
docker exec controle_pessoas_app npm run create-admin
```

## 🔐 Credenciais Padrão

Após criar o usuário admin:
- **Usuário:** `admin`
- **Senha:** `admin123`

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login em produção!

## 📝 Validações Implementadas

### Frontend
- Nome: mínimo 3 caracteres
- Email: formato válido
- CPF: validação de dígitos verificadores
- Telefone: 10 ou 11 dígitos
- CEP: 8 dígitos
- Estado: 2 caracteres (UF)
- Formatação automática de CPF, Telefone e CEP

### Backend
- Todas as validações do frontend
- Verificação de email duplicado
- Sanitização de dados
- Proteção contra SQL injection
- Autenticação obrigatória para todas as rotas da API

## 🏗️ Estrutura do Projeto

```
CONTROLE_PESSOAS/
├── public/              # Frontend
│   ├── index.html      # Página principal
│   ├── login.html      # Tela de login
│   ├── app.js          # Lógica frontend
│   ├── login.js        # Lógica de login
│   └── style.css       # Estilos
├── migrations/          # Migrações do banco
├── scripts/            # Scripts auxiliares
├── server.js           # Servidor Express
├── package.json        # Dependências
├── docker-compose.yml  # Configuração Docker
├── Dockerfile          # Imagem Docker
├── schema.sql          # Schema inicial
└── SCRUM.md           # Documentação Scrum
```

## 🔄 API Endpoints

### Autenticação
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/auth/check` - Verificar autenticação

### Pessoas (requer autenticação)
- `GET /api/people` - Listar todas
- `POST /api/people` - Criar nova
- `PUT /api/people/:id` - Atualizar
- `DELETE /api/people/:id` - Excluir

### Health Check
- `GET /api/health` - Status do servidor

## 🎯 Metodologia Scrum

O projeto utiliza metodologia Scrum. Veja `SCRUM.md` para detalhes completos.

### Sprint Atual
- **Sprint 1:** Sistema básico com autenticação e validações ✅

## 🚢 Deploy

### VPS com Docker

1. Configure os secrets no GitHub Actions:
   - `SSH_KEY`: Chave privada SSH da VPS
   - `SSH_USER`: Usuário SSH (geralmente `root`)
   - `SSH_HOST`: IP ou domínio da VPS

2. Execute o workflow manualmente ou faça push para `main`

3. Na VPS, crie o usuário admin:
```bash
docker exec controle_pessoas_app npm run create-admin
```

## 📚 Documentação Adicional

- `SCRUM.md` - Metodologia Scrum e backlog
- `DEPLOY_VPS.md` - Guia de deploy na VPS
- `GITHUB_ACTIONS_SETUP.md` - Configuração do GitHub Actions
- `CONFIGURACAO_KINGHOST.md` - Configuração de domínio

## 🛠️ Scripts Disponíveis

```bash
npm start          # Iniciar servidor
npm run dev        # Modo desenvolvimento (nodemon)
npm run migrate    # Executar migrações
npm run create-admin  # Criar usuário admin
```

## 🔒 Segurança

- Senhas hashadas com bcrypt
- Sessões HTTP-only
- Validação em múltiplas camadas
- Proteção CSRF (via sessões)
- Sanitização de inputs

## 📄 Licença

ISC

## 👨‍💻 Desenvolvido por

Bruno Souza
