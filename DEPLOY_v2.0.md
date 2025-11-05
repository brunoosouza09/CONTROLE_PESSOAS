# Deploy da Versão 2.0 - Guia Completo

## ✅ O que foi feito

### 1. Commit e Push Realizado ✅
- Todos os arquivos foram commitados
- Push para o repositório GitHub realizado
- Commit hash: `0a786d6`

### 2. Deploy Automático ✅
- GitHub Actions iniciou o deploy automaticamente
- O workflow "Deploy com Docker" está executando
- Containers serão reconstruídos com a nova versão

## 📋 Passo a Passo Após o Deploy

### Passo 1: Verificar Deploy no GitHub Actions

1. Acesse: `https://github.com/brunoosouza09/CONTROLE_PESSOAS/actions`
2. Verifique se o workflow está executando ou concluído
3. Clique no workflow mais recente para ver os logs

### Passo 2: Executar Migrações na VPS

Após o deploy concluir, execute na VPS:

```bash
# Conectar na VPS
ssh root@191.252.214.59

# Ir para o diretório do projeto
cd /root/CONTROLE_PESSOAS

# Executar migrações (criar tabela de usuários)
docker exec controle_pessoas_app npm run migrate

# Criar usuário admin
docker exec controle_pessoas_app npm run create-admin
```

### Passo 3: Verificar se Funcionou

```bash
# Verificar status dos containers
docker compose ps

# Verificar logs do app
docker compose logs app --tail=50

# Verificar se a tabela de usuários foi criada
docker exec controle_pessoas_mysql mysql -u root -proot -e "USE cadastro_pessoas; SHOW TABLES;"
```

### Passo 4: Testar o Sistema

1. Acesse: `http://cdp.controlepessoas.kinghost.net/login.html`
2. Faça login com:
   - **Usuário:** `admin`
   - **Senha:** `admin123`
3. Teste as funcionalidades:
   - Cadastrar uma pessoa
   - Validar CPF, telefone, CEP
   - Editar e excluir registros

## 🆕 Novas Funcionalidades

### Sistema de Login
- Tela de login acessível em `/login.html`
- Autenticação por nome e senha
- Sessões seguras com cookies HTTP-only
- Logout funcional

### Validações
- **CPF:** Validação completa com dígitos verificadores
- **Email:** Formato válido e verificação de duplicatas
- **Telefone:** 10 ou 11 dígitos
- **CEP:** 8 dígitos
- **Estado:** 2 caracteres (UF)
- Formatação automática de campos

### Proteção
- Todas as rotas da API requerem autenticação
- Verificação automática no frontend
- Redirecionamento para login quando necessário

## 🔧 Troubleshooting

### Erro: "Não autenticado"
- Faça login primeiro em `/login.html`
- Verifique se a sessão não expirou

### Erro: "Tabela usuarios não existe"
- Execute: `docker exec controle_pessoas_app npm run migrate`

### Erro: "Usuário não encontrado"
- Execute: `docker exec controle_pessoas_app npm run create-admin`

### Containers não estão rodando
```bash
cd /root/CONTROLE_PESSOAS
docker compose down
docker compose up -d --build
```

### Ver logs de erro
```bash
# Logs do app
docker compose logs app --tail=100

# Logs do MySQL
docker compose logs mysql --tail=50
```

## 📊 Resumo das Mudanças

### Arquivos Novos
- `public/login.html` - Tela de login
- `public/login.js` - Lógica de login
- `migrations/002_create_users_table.sql` - Tabela de usuários
- `scripts/create-admin-user.js` - Script de criação de admin
- `SCRUM.md` - Documentação Scrum
- `CHANGELOG.md` - Histórico de mudanças
- `DEPLOY_v2.0.md` - Este guia

### Arquivos Modificados
- `server.js` - Autenticação e validações backend
- `public/app.js` - Validações frontend
- `public/index.html` - Botão de logout
- `package.json` - Novas dependências
- `README.md` - Documentação atualizada

### Dependências Adicionadas
- `bcrypt` - Hash de senhas
- `express-session` - Gerenciamento de sessões

## 🎯 Próximos Passos (Opcional)

1. **Alterar senha padrão:**
   - Faça login e altere a senha do admin
   - Ou crie um novo usuário e delete o admin

2. **Configurar variável de ambiente:**
   - Adicione `SESSION_SECRET` no `.env` para maior segurança

3. **Revisar configurações:**
   - Verifique se o domínio está configurado corretamente
   - Teste todas as funcionalidades

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs: `docker compose logs`
2. Verifique o status: `docker compose ps`
3. Consulte o `CHANGELOG.md` para detalhes das mudanças
4. Consulte o `SCRUM.md` para entender a metodologia

## ✅ Checklist Final

- [ ] Deploy concluído no GitHub Actions
- [ ] Migrações executadas na VPS
- [ ] Usuário admin criado
- [ ] Login funcionando
- [ ] Validações funcionando
- [ ] CRUD funcionando
- [ ] Logout funcionando

---

**Versão:** 2.0.0  
**Data:** Novembro 2024  
**Status:** ✅ Deploy Automático Iniciado

