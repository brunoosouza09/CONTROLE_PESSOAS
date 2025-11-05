# Changelog - Sistema de Cadastro de Pessoas

## [2.0.0] - Novembro 2024

### 🎉 Melhorias Implementadas

#### 🔐 Sistema de Autenticação
- **NOVO:** Tela de login com autenticação por nome e senha
- **NOVO:** Sistema de sessões no backend (Express Session)
- **NOVO:** Proteção de todas as rotas da API
- **NOVO:** Verificação automática de autenticação no frontend
- **NOVO:** Botão de logout na interface principal
- **NOVO:** Redirecionamento automático para login quando não autenticado
- **NOVO:** Script para criar usuário admin (`npm run create-admin`)

**Credenciais Padrão:**
- Usuário: `admin`
- Senha: `admin123`

#### ✅ Validações Frontend
- **NOVO:** Validação de nome (mínimo 3 caracteres)
- **NOVO:** Validação de email (formato válido)
- **NOVO:** Validação completa de CPF (dígitos verificadores)
- **NOVO:** Validação de telefone (10 ou 11 dígitos)
- **NOVO:** Validação de CEP (8 dígitos)
- **NOVO:** Validação de estado (2 caracteres - UF)
- **NOVO:** Formatação automática de CPF (000.000.000-00)
- **NOVO:** Formatação automática de telefone ((00) 00000-0000)
- **NOVO:** Formatação automática de CEP (00000-000)
- **NOVO:** Conversão automática de estado para maiúsculas
- **NOVO:** Mensagens de erro específicas e claras
- **NOVO:** Validação em tempo real durante digitação

#### 🛡️ Validações Backend
- **NOVO:** Validação de nome (obrigatório, mínimo 3 caracteres)
- **NOVO:** Validação de email (obrigatório, formato válido)
- **NOVO:** Validação completa de CPF (algoritmo oficial)
- **NOVO:** Validação de telefone (10 ou 11 dígitos)
- **NOVO:** Validação de CEP (8 dígitos)
- **NOVO:** Validação de estado (2 caracteres)
- **NOVO:** Verificação de email duplicado (não permite cadastrar mesmo email duas vezes)
- **NOVO:** Sanitização de dados (trim, lowercase, remoção de caracteres especiais)
- **NOVO:** Normalização de dados (CPF, telefone e CEP apenas números)
- **MELHORADO:** Mensagens de erro mais específicas e úteis

#### 📊 Metodologia Scrum
- **NOVO:** Documentação completa da metodologia Scrum (`SCRUM.md`)
- **NOVO:** Product Backlog estruturado
- **NOVO:** Sprint Backlog da Sprint 1
- **NOVO:** Definição de Pronto (DoD)
- **NOVO:** Métricas de velocidade da equipe
- **NOVO:** Estrutura de reuniões e processos

#### 🎨 Melhorias de UX/UI
- **NOVO:** Notificações de sucesso (toast notifications)
- **NOVO:** Botão de logout visível no cabeçalho
- **NOVO:** Feedback visual durante ações (botões desabilitados, textos de loading)
- **NOVO:** Mensagem quando não há registros cadastrados
- **MELHORADO:** Tratamento de erros mais amigável
- **MELHORADO:** Scroll automático ao editar registro

#### 🔧 Melhorias Técnicas
- **NOVO:** Dependência `bcrypt` para hash de senhas
- **NOVO:** Dependência `express-session` para gerenciamento de sessões
- **NOVO:** Middleware de autenticação (`requireAuth`)
- **NOVO:** Funções de validação reutilizáveis
- **NOVO:** Tabela `usuarios` no banco de dados
- **NOVO:** Script `create-admin-user.js` para criar usuário inicial
- **MELHORADO:** Estrutura de código mais organizada
- **MELHORADO:** Tratamento de erros mais robusto

### 📝 Arquivos Criados

- `public/login.html` - Tela de login
- `public/login.js` - Lógica de autenticação no frontend
- `migrations/002_create_users_table.sql` - Migração da tabela de usuários
- `scripts/create-admin-user.js` - Script para criar usuário admin
- `SCRUM.md` - Documentação da metodologia Scrum
- `CHANGELOG.md` - Este arquivo

### 📝 Arquivos Modificados

- `server.js` - Sistema completo de autenticação e validações
- `public/app.js` - Validações frontend e controle de autenticação
- `public/index.html` - Adicionado botão de logout
- `package.json` - Novas dependências e script `create-admin`
- `README.md` - Documentação atualizada com novas funcionalidades

### 🔄 Migração Necessária

Para atualizar o banco de dados, execute:

```bash
# Na VPS ou localmente
npm run migrate
npm run create-admin
```

### ⚠️ Breaking Changes

- **ATENÇÃO:** Todas as rotas da API (`/api/people/*`) agora requerem autenticação
- **ATENÇÃO:** É necessário fazer login antes de acessar o sistema
- **ATENÇÃO:** Execute o script `create-admin` para criar o primeiro usuário

### 🐛 Correções

- **CORRIGIDO:** Validação de dados inconsistente entre frontend e backend
- **CORRIGIDO:** Falta de validação de CPF e telefone
- **CORRIGIDO:** Falta de proteção nas rotas da API
- **CORRIGIDO:** Mensagens de erro genéricas

### 📚 Documentação

- **NOVO:** `SCRUM.md` - Documentação completa da metodologia Scrum
- **ATUALIZADO:** `README.md` - Instruções atualizadas com novas funcionalidades
- **NOVO:** `CHANGELOG.md` - Histórico de mudanças

### 🚀 Deploy

Este update é compatível com o sistema de deploy automático via GitHub Actions. Após o push, o deploy será executado automaticamente na VPS.

**Após o deploy, execute na VPS:**
```bash
docker exec controle_pessoas_app npm run create-admin
```

---

## Versões Anteriores

### [1.0.0] - Versão Inicial
- Sistema básico de cadastro de pessoas
- CRUD completo (Create, Read, Update, Delete)
- Interface responsiva
- Deploy automatizado com Docker
- Integração com GitHub Actions

