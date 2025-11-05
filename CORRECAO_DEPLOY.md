# Correção do Deploy - Problemas Resolvidos

## 🔧 Problemas Identificados e Corrigidos

### 1. ❌ Erro: "No database selected"
**Problema:** O migrate.js não estava selecionando o banco de dados antes de executar queries.

**Correção:** ✅ Adicionado seleção automática do banco de dados no migrate.js
- Commit: `a684cbb`

### 2. ❌ Erro: "Missing script: create-admin"
**Problema:** O script não estava disponível porque o código não foi atualizado no container.

**Solução:** Aguardar o novo deploy ou fazer pull manual.

## 🚀 Passo a Passo Após o Novo Deploy

### Opção 1: Aguardar Deploy Automático (Recomendado)

1. **Aguarde o deploy automático concluir** (2-3 minutos)
   - Verifique em: `https://github.com/brunoosouza09/CONTROLE_PESSOAS/actions`

2. **Conecte na VPS:**
   ```bash
   ssh root@191.252.214.59
   ```

3. **Execute os comandos:**
   ```bash
   cd /root/CONTROLE_PESSOAS
   
   # Executar migrações (agora corrigido)
   docker exec controle_pessoas_app npm run migrate
   
   # Criar usuário admin
   docker exec controle_pessoas_app npm run create-admin
   ```

### Opção 2: Atualizar Manualmente (Se Deploy Não Funcionar)

```bash
# Conectar na VPS
ssh root@191.252.214.59

# Ir para o diretório
cd /root/CONTROLE_PESSOAS

# Fazer pull do código atualizado
git pull origin main

# Reconstruir containers
docker compose down
docker compose up -d --build

# Aguardar containers iniciarem
sleep 10

# Executar migrações
docker exec controle_pessoas_app npm run migrate

# Criar usuário admin
docker exec controle_pessoas_app npm run create-admin
```

## ✅ Verificação

Após executar os comandos, verifique:

```bash
# Verificar se a tabela de usuários foi criada
docker exec controle_pessoas_mysql mysql -u root -proot -e "USE cadastro_pessoas; SHOW TABLES;"

# Verificar se o usuário admin foi criado
docker exec controle_pessoas_mysql mysql -u root -proot -e "USE cadastro_pessoas; SELECT * FROM usuarios;"
```

## 🔐 Credenciais

Após criar o usuário admin:
- **Usuário:** `admin`
- **Senha:** `admin123`

## 🌐 Acessar

Após tudo configurado:
- Acesse: `http://cdp.controlepessoas.kinghost.net/login.html`
- Faça login com as credenciais acima

## 📝 Notas

- O problema do migrate.js foi corrigido no commit `a684cbb`
- O script `create-admin` está no package.json e será disponibilizado após o deploy
- Se ainda der erro, verifique os logs: `docker compose logs app`

---

**Última atualização:** Correção aplicada e commitado

