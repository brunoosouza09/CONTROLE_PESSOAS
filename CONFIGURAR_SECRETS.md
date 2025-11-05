# 🔐 Configurar Secrets no GitHub

## Secrets Necessários

Você precisa configurar **3 secrets** como **Repository secrets**:

1. **`CLOUD_SSH_KEY`** - Chave privada SSH
2. **`CLOUD_HOST`** - IP ou domínio da VPS
3. **`CLOUD_USER`** - Usuário SSH (geralmente `root`)

## Passo a Passo

### 1. Acessar Secrets
1. Vá para: https://github.com/brunoosouza09/CONTROLE_PESSOAS/settings/secrets/actions
2. Certifique-se de estar na aba **"Repository secrets"** (não "Environment secrets")

### 2. Configurar CLOUD_SSH_KEY

1. Clique em **"New repository secret"**
2. **Name**: `CLOUD_SSH_KEY`
3. **Secret**: Cole a chave privada SSH completa (desde `-----BEGIN` até `-----END`)
4. Clique em **"Add secret"**

**Como obter a chave SSH na VPS:**
```bash
ssh root@191.252.214.59
cat ~/.ssh/github_actions
```

### 3. Configurar CLOUD_HOST

1. Clique em **"New repository secret"**
2. **Name**: `CLOUD_HOST`
3. **Secret**: `191.252.214.59` (IP da sua VPS)
4. Clique em **"Add secret"**

### 4. Configurar CLOUD_USER

1. Clique em **"New repository secret"**
2. **Name**: `CLOUD_USER`
3. **Secret**: `root`
4. Clique em **"Add secret"**

## Verificação Final

Após configurar, você deve ter 3 secrets:
- ✅ `CLOUD_SSH_KEY`
- ✅ `CLOUD_HOST`
- ✅ `CLOUD_USER`

## Testar

Após configurar, o workflow deve rodar automaticamente no próximo push, ou você pode executar manualmente:
1. Acesse: https://github.com/brunoosouza09/CONTROLE_PESSOAS/actions
2. Clique em "Deploy com Docker"
3. Clique em "Run workflow"

