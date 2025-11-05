# 🔐 Configurar SSH Key para GitHub Actions

## Passo 1: Gerar Nova Chave SSH na VPS

Execute na VPS:

```bash
# Conectar na VPS
ssh root@191.252.214.59

# Gerar nova chave SSH (se já existir, será sobrescrita)
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions -N ""

# Mostrar a chave PRIVADA (copie TODO o conteúdo)
cat ~/.ssh/github_actions

# Adicionar chave pública ao authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Verificar permissões
chmod 600 ~/.ssh/github_actions
chmod 644 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

## Passo 2: Configurar no GitHub

### 2.1. Acessar Secrets
1. Vá para: https://github.com/brunoosouza09/CONTROLE_PESSOAS/settings/secrets/actions
2. Procure pelo secret `SSH_KEY`

### 2.2. Deletar Secret Antigo (se existir)
1. Clique no secret `SSH_KEY`
2. Clique em "Delete" (ou "Remove")
3. Confirme a exclusão

### 2.3. Criar Novo Secret
1. Clique em **"New repository secret"**
2. **Name**: Digite exatamente `SSH_KEY` (maiúsculas)
3. **Secret**: Cole a chave PRIVADA completa que você copiou do `cat ~/.ssh/github_actions`
   - Deve incluir `-----BEGIN OPENSSH PRIVATE KEY-----` no início
   - Deve incluir `-----END OPENSSH PRIVATE KEY-----` no final
   - Copie TUDO, sem espaços extras antes ou depois
4. Clique em **"Add secret"**

### 2.4. Verificar Outros Secrets
Confirme que existem também:
- `SSH_USER` com valor: `root` (ou deixe vazio)
- `SSH_HOST` com valor: `191.252.214.59`

## Passo 3: Testar o Deploy

### Opção 1: Via GitHub (Recomendado)
1. Acesse: https://github.com/brunoosouza09/CONTROLE_PESSOAS/actions
2. Clique em **"Deploy com Docker"**
3. Clique em **"Run workflow"** (botão no canto direito)
4. Selecione branch **"main"**
5. Clique em **"Run workflow"** (botão verde)

### Opção 2: Via Push (Automático)
Faça um commit vazio para disparar:
```bash
git commit --allow-empty -m "test: Testar deploy após reconfiguração SSH"
git push origin main
```

## Passo 4: Verificar Logs

Após executar, acesse o workflow e verifique:
- ✅ **Adiciona chave SSH** - deve passar
- ✅ **Testar conexão SSH** - deve mostrar "Conexão SSH OK"
- ✅ **Deploy via SSH com Docker** - deve executar todos os passos

## Se Ainda Der Erro

### Erro: "Permission denied (publickey)"
- Verifique se a chave pública está em `~/.ssh/authorized_keys` na VPS
- Execute: `cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys`

### Erro: "Secret SSH_KEY não configurado"
- Verifique se o nome está exatamente `SSH_KEY` (case-sensitive)
- Verifique se não há espaços extras no início ou fim da chave
- Tente deletar e recriar o secret

### Erro: "Connection refused"
- Verifique se a porta 22 está aberta na VPS
- Teste: `ssh root@191.252.214.59` (deve conectar)

