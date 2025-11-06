# 📚 Documentação Completa - Sistema de Cadastro de Pessoas

## 📋 Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
3. [Funcionalidades Implementadas](#funcionalidades-implementadas)
4. [Infraestrutura](#infraestrutura)
5. [Sistema de Monitoramento](#sistema-de-monitoramento)
6. [CI/CD e Deploy Automático](#cicd-e-deploy-automático)
7. [Autenticação e Segurança](#autenticação-e-segurança)
8. [Validações](#validações)
9. [Testes Automatizados](#testes-automatizados)
10. [Estrutura do Projeto](#estrutura-do-projeto)

---

## 🎯 Visão Geral do Projeto

### Descrição

Sistema completo de cadastro e gerenciamento de pessoas, desenvolvido com metodologia Scrum, incluindo interface web moderna, API RESTful, banco de dados MySQL, e sistema completo de monitoramento e observabilidade.

### Objetivo

Fornecer uma solução robusta para cadastro, edição, exclusão e visualização de informações de pessoas, com validações completas, autenticação, monitoramento em tempo real e deploy automatizado.

### Características Principais

- ✅ **Interface Web Moderna**: Design responsivo com tema azul claro
- ✅ **API RESTful**: Endpoints completos para CRUD
- ✅ **Autenticação**: Sistema de login com sessões
- ✅ **Validações**: Frontend e backend com validações robustas
- ✅ **Monitoramento**: Grafana, Prometheus e Uptime Kuma
- ✅ **CI/CD**: Deploy automático via GitHub Actions
- ✅ **Docker**: Containerização completa da aplicação
- ✅ **Testes**: Testes automatizados com Jest

---

## 🏗️ Arquitetura e Tecnologias

### Stack Tecnológico

#### Frontend
- **HTML5/CSS3**: Interface moderna com CSS variables
- **JavaScript Vanilla**: Sem frameworks, código puro e performático
- **Design Responsivo**: Adaptável a diferentes tamanhos de tela

#### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web minimalista
- **MySQL**: Banco de dados relacional
- **bcrypt**: Hashing de senhas
- **express-session**: Gerenciamento de sessões

#### Monitoramento
- **Prometheus**: Coleta de métricas
- **Grafana**: Visualização e dashboards
- **Uptime Kuma**: Monitoramento de disponibilidade

#### Infraestrutura
- **Docker**: Containerização
- **Docker Compose**: Orquestração de containers
- **Nginx**: Reverse proxy
- **GitHub Actions**: CI/CD

#### Testes
- **Jest**: Framework de testes
- **Supertest**: Testes de API

---

## ✨ Funcionalidades Implementadas

### 1. Cadastro de Pessoas

#### Campos do Formulário
- **Nome**: Obrigatório, mínimo 3 caracteres
- **Email**: Obrigatório, formato válido, único
- **Telefone**: Opcional, formato brasileiro (10 ou 11 dígitos)
- **CPF**: Opcional, validação de dígitos verificadores
- **Data de Nascimento**: Opcional, formato ISO
- **Endereço**: Opcional
- **Cidade**: Opcional
- **Estado**: Opcional, 2 caracteres (UF)
- **CEP**: Opcional, 8 dígitos
- **Gênero**: Opcional

#### Operações CRUD
- ✅ **Create**: Cadastro de novas pessoas
- ✅ **Read**: Listagem e visualização
- ✅ **Update**: Edição de dados
- ✅ **Delete**: Exclusão de registros

### 2. Sistema de Autenticação

#### Login
- Username e senha
- Hash de senha com bcrypt
- Sessões seguras com express-session
- Redirecionamento automático para login se não autenticado

#### Logout
- Destruição de sessão
- Redirecionamento para tela de login

#### Usuário Padrão
- **Username**: `admin`
- **Senha**: `admin123`
- Criado automaticamente via script de migração

### 3. Validações

#### Frontend
- Validação em tempo real nos campos
- Mensagens de erro claras
- Prevenção de envio de dados inválidos

#### Backend
- Validação completa de todos os campos
- Verificação de duplicidade de email
- Validação de CPF (dígitos verificadores)
- Validação de formato de telefone
- Validação de CEP

### 4. Interface

#### Tema
- Fundo azul claro (`#e3f2fd`)
- Cards brancos
- Texto escuro para legibilidade
- Hover effects suaves

#### Tabela
- Layout responsivo
- Colunas centralizadas
- Formatação automática de dados (CPF, telefone, data)
- Botões de ação (Editar/Excluir)

#### Notificações
- Mensagens de sucesso/erro animadas
- Auto-dismiss após alguns segundos
- Design moderno e não intrusivo

---

## 🖥️ Infraestrutura

### Arquitetura Docker

O projeto utiliza Docker Compose para orquestrar múltiplos serviços:

```
┌─────────────────────────────────────────┐
│           Nginx (Porta 80)              │
│         (Reverse Proxy)                 │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Aplicação Node.js (Porta 3000)     │
│      - Express.js                        │
│      - API REST                          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      MySQL 8.0 (Porta 3306)              │
│      - Banco de dados                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      Prometheus (Porta 9090)            │
│      - Coleta de métricas               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Grafana (Porta 3001)               │
│      - Visualização de métricas         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      Uptime Kuma (Porta 3002)           │
│      - Monitoramento de disponibilidade │
└─────────────────────────────────────────┘
```

### Serviços Docker

#### 1. Aplicação (app)
- **Container**: `controle_pessoas_app`
- **Porta**: 3000 (interno) → 3000 (externo)
- **Imagem**: Build customizado via Dockerfile
- **Volumes**: 
  - `./public:/app/public`
  - `./server.js:/app/server.js`

#### 2. MySQL
- **Container**: `controle_pessoas_mysql`
- **Porta**: 3306
- **Imagem**: `mysql:8.0`
- **Volumes**: 
  - `mysql_data:/var/lib/mysql`
  - `./schema.sql:/docker-entrypoint-initdb.d/schema.sql`
- **Healthcheck**: Verifica disponibilidade antes de iniciar app

#### 3. Nginx
- **Container**: `controle_pessoas_nginx`
- **Porta**: 80
- **Imagem**: `nginx:latest`
- **Configuração**: `nginx.conf` (reverse proxy)
- **Função**: Proxy reverso para a aplicação Node.js

#### 4. Prometheus
- **Container**: `controle_pessoas_prometheus`
- **Porta**: 9090
- **Imagem**: `prom/prometheus:latest`
- **Configuração**: `prometheus.yml`
- **Função**: Coleta métricas da aplicação

#### 5. Grafana
- **Container**: `controle_pessoas_grafana`
- **Porta**: 3001 (interno) → 3001 (externo)
- **Imagem**: `grafana/grafana:latest`
- **Credenciais**: admin/admin123
- **Função**: Dashboards e visualização de métricas

#### 6. Uptime Kuma
- **Container**: `controle_pessoas_uptime_kuma`
- **Porta**: 3002 (interno) → 3002 (externo)
- **Imagem**: `louislam/uptime-kuma:latest`
- **Função**: Monitoramento de disponibilidade dos serviços

### Rede Docker

Todos os serviços estão na mesma rede Docker (`default`), permitindo comunicação pelo nome do serviço:
- `controle_pessoas_app:3000`
- `controle_pessoas_mysql:3306`
- `prometheus:9090`
- `grafana:3000`

### Volumes Persistentes

- `mysql_data`: Dados do MySQL
- `prometheus_data`: Dados do Prometheus
- `grafana_data`: Configurações e dashboards do Grafana
- `uptime_kuma_data`: Dados do Uptime Kuma

---

## 📊 Sistema de Monitoramento

### 1. Prometheus

#### Métricas Coletadas

**Métricas HTTP:**
- `http_requests_total`: Total de requisições HTTP
- `http_request_duration_seconds`: Duração das requisições

**Métricas de Banco de Dados:**
- `db_connections_active`: Conexões ativas
- `db_queries_total`: Total de queries por operação (SELECT, INSERT, UPDATE, DELETE)

**Métricas de Erros:**
- `errors_total`: Total de erros por tipo e endpoint

**Métricas de Sistema:**
- `process_resident_memory_bytes`: Uso de memória
- `process_cpu_user_seconds_total`: Uso de CPU
- `nodejs_heap_size_total_bytes`: Heap do Node.js

**Métricas Customizadas:**
- `active_users`: Usuários ativos (sessões)

#### Configuração

Arquivo `prometheus.yml`:
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'cadastro-pessoas'
    static_configs:
      - targets: ['controle_pessoas_app:3000']
    metrics_path: '/metrics'
```

#### Acesso

- **URL**: `http://SEU_IP_VPS:9090`
- **Endpoint de Métricas**: `http://localhost:3000/metrics`

### 2. Grafana

#### Dashboards

Dashboard principal inclui:
1. **Requisições HTTP por Segundo**: Taxa de requisições por método e rota
2. **Tempo de Resposta (p95)**: Percentil 95 do tempo de resposta
3. **Erros por Tipo**: Distribuição de erros
4. **Uso de Memória**: Consumo de memória em MB
5. **Queries do Banco**: Taxa de queries por operação
6. **Status dos Targets**: Status dos serviços monitorados
7. **Total de Requisições**: Contador total de requisições

#### Configuração

- **Data Source**: Prometheus (`http://prometheus:9090`)
- **Refresh**: 30 segundos
- **Time Range**: Últimas 6 horas

#### Acesso

- **URL**: `http://SEU_IP_VPS:3001`
- **Login**: `admin` / `admin123`

### 3. Uptime Kuma

#### Monitores Configurados

1. **Aplicação Web**: HTTP - `http://localhost`
2. **Grafana**: HTTP - `http://localhost:3001`
3. **Prometheus**: HTTP - `http://localhost:9090`
4. **Uptime Kuma**: HTTP - `http://localhost:3002` (auto-monitoramento)
5. **MySQL**: TCP - `controle_pessoas_mysql:3306`
6. **Nginx**: TCP - `localhost:80`

#### Funcionalidades

- ✅ Monitoramento a cada 60 segundos
- ✅ Histórico de uptime (24h e 30 dias)
- ✅ Notificações (Telegram, Email, Discord)
- ✅ Status page pública
- ✅ Dashboard visual com timeline

#### Acesso

- **URL**: `http://SEU_IP_VPS:3002`
- **Criação de conta**: Primeiro acesso requer criação de admin

---

## 🚀 CI/CD e Deploy Automático

### GitHub Actions

#### Workflow: Deploy Automático

**Trigger:**
- Push para branch `main`
- Execução manual (`workflow_dispatch`)

**Etapas:**

1. **Checkout do Código**
   - Clona o repositório

2. **Configurar Node.js**
   - Instala Node.js 18
   - Configura cache do npm

3. **Instalar Dependências**
   - Executa `npm ci`
   - Instala todas as dependências

4. **Executar Testes**
   - Executa `npm test`
   - Não bloqueia deploy se falhar (continue-on-error)

5. **Verificar Secrets**
   - Valida presença de `CLOUD_SSH_KEY` ou `SSH_KEY`
   - Valida presença de `CLOUD_HOST` ou `SSH_HOST`
   - Configura `SSH_USER` (padrão: root)

6. **Adicionar Chave SSH**
   - Cria arquivo `key.pem` com a chave privada
   - Adiciona host à known_hosts

7. **Deploy via SSH**
   - Conecta na VPS via SSH
   - Limpa mudanças locais (`git reset --hard`)
   - Faz pull do código (`git fetch` + `git reset --hard origin/main`)
   - Para containers (`docker compose down`)
   - Reconstrói e inicia containers (`docker compose up -d --build`)
   - Verifica status e logs

#### Secrets Necessários

Configure no GitHub: **Settings** → **Secrets and variables** → **Actions**

1. **CLOUD_SSH_KEY** (ou `SSH_KEY`)
   - Chave privada SSH da VPS
   - Formato: `-----BEGIN OPENSSH PRIVATE KEY-----...`

2. **CLOUD_HOST** (ou `SSH_HOST`)
   - IP ou domínio da VPS
   - Exemplo: `191.252.214.59`

3. **CLOUD_USER** (ou `SSH_USER`) - Opcional
   - Usuário SSH (padrão: `root`)

#### Arquivo de Workflow

Localização: `.github/workflows/deploy.yml`

### Processo de Deploy

1. **Desenvolvedor faz push** → GitHub recebe código
2. **GitHub Actions inicia** → Workflow é executado
3. **Testes são executados** → Validação do código
4. **Conexão SSH** → Conecta na VPS
5. **Atualização do código** → Git pull/reset
6. **Reconstrução** → Docker rebuild
7. **Reinício dos serviços** → Containers são reiniciados
8. **Verificação** → Status e logs são verificados

### Vantagens

- ✅ **Zero downtime**: Containers são recriados sem parar o serviço por muito tempo
- ✅ **Rollback fácil**: Git mantém histórico, fácil voltar versão anterior
- ✅ **Automação completa**: Push = Deploy automático
- ✅ **Testes antes do deploy**: Validação automática

---

## 🔐 Autenticação e Segurança

### Sessões

#### Configuração
- **Secret**: Variável de ambiente `SESSION_SECRET`
- **Cookie**: HttpOnly, SameSite: lax
- **Duração**: 24 horas
- **Armazenamento**: Memória (pode ser alterado para Redis em produção)

### Hash de Senhas

- **Biblioteca**: bcrypt
- **Rounds**: 10 (padrão)
- **Armazenamento**: Hash no banco, nunca senha em texto plano

### Proteção de Rotas

- **Middleware**: `requireAuth`
- **Rotas protegidas**: `/api/people/*`
- **Rotas públicas**: `/api/login`, `/api/logout`, `/api/health`, `/metrics`

### CORS

- **Configuração**: Permite credenciais
- **Origem**: Qualquer origem (pode ser restrito em produção)

---

## ✅ Validações

### Frontend

#### Validações em Tempo Real
- **Nome**: Mínimo 3 caracteres
- **Email**: Formato válido
- **Telefone**: 10 ou 11 dígitos
- **CPF**: 11 dígitos, validação de dígitos verificadores
- **Data**: Formato válido
- **CEP**: 8 dígitos
- **Estado**: 2 caracteres

### Backend

#### Validações Completas
- **Nome**: Obrigatório, mínimo 3 caracteres, trim
- **Email**: Obrigatório, formato válido, único, lowercase
- **Telefone**: Opcional, formato válido
- **CPF**: Opcional, validação completa de dígitos verificadores
- **CEP**: Opcional, 8 dígitos
- **Estado**: Opcional, 2 caracteres, uppercase

#### Prevenção de Duplicatas
- Verificação de email duplicado antes de inserir/atualizar
- Erro específico: "Email já cadastrado"

---

## 🧪 Testes Automatizados

### Framework

- **Jest**: Framework de testes
- **Supertest**: Testes de API HTTP

### Cobertura

#### Testes de Validação (`__tests__/validations.test.js`)
- ✅ Validação de email
- ✅ Validação de CPF
- ✅ Validação de telefone
- ✅ Validação de CEP

#### Testes de API (`__tests__/api.test.js`)
- ✅ Health check
- ✅ Login
- ✅ Autenticação (401 sem login)
- ✅ CRUD de pessoas

### Execução

```bash
# Executar todos os testes
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:coverage
```

### Integração CI

Testes são executados automaticamente no GitHub Actions antes do deploy.

---

## 📁 Estrutura do Projeto

```
CONTROLE_PESSOAS/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Workflow de deploy
│       └── ci.yml              # Workflow de CI
├── __tests__/
│   ├── api.test.js             # Testes de API
│   └── validations.test.js     # Testes de validação
├── logs/                       # Logs da aplicação
│   ├── app.log                 # Log geral
│   └── error.log               # Log de erros
├── middleware/
│   └── monitoring.js           # Middlewares de monitoramento
├── migrations/
│   ├── 001_create_pessoas_table.sql
│   └── 002_create_users_table.sql
├── public/
│   ├── index.html              # Página principal
│   ├── login.html              # Página de login
│   ├── app.js                  # Frontend JavaScript
│   ├── login.js                # JavaScript do login
│   └── style.css               # Estilos CSS
├── routes/
│   ├── metrics.js              # Endpoint de métricas
│   └── prometheus.js           # Exporter Prometheus
├── scripts/
│   └── create-admin-user.js    # Script de criação de admin
├── utils/
│   └── logger.js               # Sistema de logging
├── .gitignore
├── docker-compose.yml          # Configuração Docker Compose
├── Dockerfile                  # Build da aplicação
├── jest.config.js              # Configuração Jest
├── migrate.js                  # Script de migração
├── nginx.conf                  # Configuração Nginx
├── package.json                # Dependências Node.js
├── prometheus.yml              # Configuração Prometheus
├── schema.sql                  # Schema inicial do banco
├── server.js                   # Servidor Express
└── README.md                   # Documentação principal
```

---

## 🔄 Fluxo de Dados

### Requisição HTTP

```
Cliente (Navegador)
    ↓
Nginx (Porta 80)
    ↓
Aplicação Node.js (Porta 3000)
    ↓
    ├─→ Middleware de Autenticação
    ├─→ Middleware de Logging
    ├─→ Middleware de Métricas (Prometheus)
    ├─→ Validação
    └─→ Banco de Dados MySQL
```

### Coleta de Métricas

```
Aplicação Node.js
    ↓ (emite métricas)
Endpoint /metrics
    ↓
Prometheus (coleta a cada 15s)
    ↓
Grafana (visualiza)
```

### Monitoramento

```
Uptime Kuma
    ├─→ Verifica HTTP (a cada 60s)
    ├─→ Verifica TCP (a cada 60s)
    └─→ Notifica em caso de falha
```

---

## 📈 Métricas e Observabilidade

### Logs

#### Sistema de Logging
- **Formato**: JSON estruturado
- **Arquivos**: 
  - `logs/app.log` - Todos os logs
  - `logs/error.log` - Apenas erros
- **Níveis**: INFO, WARN, ERROR, FATAL, HTTP

#### Endpoints de Monitoramento
- `/api/health` - Health check
- `/api/metrics` - Métricas da aplicação (requer auth)
- `/metrics` - Métricas Prometheus (público)

### Alertas

Configuráveis via:
- **Grafana**: Alertas baseados em métricas
- **Uptime Kuma**: Notificações de downtime

---

## 🛠️ Comandos Úteis

### Docker

```bash
# Ver status dos containers
docker compose ps

# Ver logs
docker compose logs -f

# Reiniciar um serviço
docker compose restart grafana

# Reconstruir e iniciar
docker compose up -d --build

# Parar tudo
docker compose down
```

### Logs

```bash
# Ver logs da aplicação
npm run logs

# Ver apenas erros
npm run logs:error

# Ver logs do container
docker logs controle_pessoas_app
```

### Testes

```bash
# Executar testes
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:coverage
```

### Banco de Dados

```bash
# Executar migrações
npm run migrate

# Criar usuário admin
npm run create-admin
```

---

## 🎯 Próximos Passos (Melhorias Futuras)

### Sugestões de Melhorias

1. **Cache**: Implementar Redis para cache de queries
2. **Paginação**: Adicionar paginação na listagem
3. **Busca**: Implementar busca/filtro na tabela
4. **Exportação**: Exportar dados para CSV/Excel
5. **Importação**: Importar dados em lote
6. **Auditoria**: Log de todas as alterações
7. **Backup**: Backup automático do banco de dados
8. **HTTPS**: Configurar certificado SSL
9. **Multi-tenancy**: Suporte a múltiplas organizações
10. **API Rate Limiting**: Limitar requisições por IP

---

## 📞 Suporte e Documentação Adicional

### Documentos Relacionados

- `README.md` - Guia de instalação e uso básico
- `INTEGRACAO_GRAFANA.md` - Guia detalhado do Grafana
- `MONITORAMENTO.md` - Documentação de monitoramento
- `TROUBLESHOOTING_DEPLOY.md` - Solução de problemas de deploy
- `GUIA_MONITORES_UPTIME_KUMA.md` - Configuração de monitores

### Links Úteis

- **Grafana**: http://SEU_IP_VPS:3001
- **Prometheus**: http://SEU_IP_VPS:9090
- **Uptime Kuma**: http://SEU_IP_VPS:3002
- **Aplicação**: http://SEU_IP_VPS

---

## 📝 Changelog

### Versão 2.0 (Atual)

- ✅ Sistema de autenticação completo
- ✅ Validações frontend e backend
- ✅ Integração com Prometheus
- ✅ Dashboards no Grafana
- ✅ Monitoramento com Uptime Kuma
- ✅ Deploy automático via GitHub Actions
- ✅ Sistema de logging estruturado
- ✅ Testes automatizados
- ✅ Tema azul claro

### Versão 1.0

- ✅ CRUD básico de pessoas
- ✅ Interface web
- ✅ API RESTful
- ✅ Banco de dados MySQL

---

## 👥 Contribuição

Este é um projeto desenvolvido seguindo metodologia Scrum, com foco em:
- Qualidade de código
- Testes automatizados
- Monitoramento completo
- Deploy automatizado
- Documentação detalhada

---

**Última atualização**: Novembro 2025
**Versão**: 2.0
**Status**: ✅ Produção

