# Configuração e Teste do GitHub Actions

## Status Atual

O workflow está configurado para **deploy manual** (`workflow_dispatch`), o que significa que você precisa executá-lo manualmente quando quiser fazer deploy.

## Pré-requisitos: Configurar Secrets no GitHub

Para o GitHub Actions funcionar, você precisa configurar 3 secrets no seu repositório:

### 1. Acessar Secrets no GitHub

1. Vá para o seu repositório: `https://github.com/brunoosouza09/CONTROLE_PESSOAS`
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret**

### 2. Configurar os Secrets

Você precisa criar 3 secrets:

#### Secret 1: `SSH_KEY`
- **Nome**: `SSH_KEY`
- **Valor**: Chave privada SSH da VPS

**Como obter na VPS:**
```bash
# Na VPS, gerar chave SSH (se ainda não tiver)
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions

# Exibir a chave PRIVADA (copie tudo, incluindo -----BEGIN e -----END)
cat ~/.ssh/github_actions

# Adicionar chave pública ao authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
```

**⚠️ IMPORTANTE**: Copie a chave **PRIVADA** (arquivo `~/.ssh/github_actions` sem extensão `.pub`)

#### Secret 2: `SSH_USER`
- **Nome**: `SSH_USER`
- **Valor**: `root`

#### Secret 3: `SSH_HOST`
- **Nome**: `SSH_HOST`
- **Valor**: `191.252.214.59` (ou `cdp.controlepessoas.kinghost.net`)

### 3. Verificar Secrets Configurados

Você deve ter estes 3 secrets:
- ✅ `SSH_KEY`
- ✅ `SSH_USER`
- ✅ `SSH_HOST`

## Como Executar o Deploy

### Opção 1: Via Interface do GitHub (Recomendado)

1. Acesse: `https://github.com/brunoosouza09/CONTROLE_PESSOAS/actions`
2. No menu lateral, clique em **"Deploy com Docker"**
3. Clique no botão **"Run workflow"** (no lado direito)
4. Selecione a branch **"main"**
5. Clique em **"Run workflow"** (botão verde)

### Opção 2: Via API do GitHub (Avançado)

```bash
# Você precisará de um token de acesso pessoal do GitHub
curl -X POST \
  -H "Authorization: token SEU_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/brunoosouza09/CONTROLE_PESSOAS/actions/workflows/deploy.yml/dispatches \
  -d '{"ref":"main"}'
```

## O que o Workflow Faz

Quando executado, o workflow:

1. ✅ Faz checkout do código mais recente
2. ✅ Conecta na VPS via SSH usando a chave configurada
3. ✅ Entra no diretório `/root/CONTROLE_PESSOAS`
4. ✅ Faz `git pull origin main`
5. ✅ Para os containers existentes (`docker compose down`)
6. ✅ Reconstrói e inicia os containers (`docker compose up -d --build`)
7. ✅ Verifica status e logs dos containers
8. ✅ Mostra mensagem de sucesso

## Testar se Está Funcionando

### 1. Verificar se os Secrets estão configurados

No GitHub:
- Vá em **Settings** → **Secrets and variables** → **Actions**
- Verifique se os 3 secrets existem

### 2. Executar o Workflow

1. Acesse: `https://github.com/brunoosouza09/CONTROLE_PESSOAS/actions`
2. Clique em **"Run workflow"**
3. Selecione branch **main**
4. Execute

### 3. Verificar Logs

Após executar, você verá:
- Status de cada etapa
- Logs do deploy
- Se houve erros

### 4. Verificar na VPS

Após o deploy, na VPS:
```bash
cd /root/CONTROLE_PESSOAS
docker compose ps
# Deve mostrar todos os containers rodando
```

## Troubleshooting

### Erro: "Permission denied (publickey)"

**Causa**: Chave SSH incorreta ou não configurada

**Solução**:
1. Verifique se a chave privada está correta no secret `SSH_KEY`
2. Verifique se a chave pública está em `~/.ssh/authorized_keys` na VPS
3. Teste a conexão manualmente:
   ```bash
   # Na sua máquina local, teste:
   ssh -i ~/.ssh/github_actions root@191.252.214.59
   ```

### Erro: "Host key verification failed"

**Causa**: Host key não confiado

**Solução**: O workflow já usa `-o StrictHostKeyChecking=no`, então isso não deveria acontecer. Se acontecer, adicione o host key manualmente.

### Erro: "Connection refused" ou "Connection timed out"

**Causa**: Porta 22 (SSH) bloqueada ou VPS inacessível

**Solução**:
1. Verifique se a porta 22 está aberta na VPS
2. Verifique se o IP está correto no secret `SSH_HOST`
3. Teste a conexão:
   ```bash
   ssh root@191.252.214.59
   ```

### Erro: "docker compose: command not found"

**Causa**: Docker Compose não instalado na VPS

**Solução**: Na VPS, instale:
```bash
apt install docker-compose-plugin -y
```

### Erro: "git pull failed"

**Causa**: Conflitos no repositório da VPS

**Solução**: Na VPS, execute:
```bash
cd /root/CONTROLE_PESSOAS
./fix-vps-git.sh
```

## Automação Futura (Opcional)

Se quiser que o deploy seja automático a cada push na branch `main`, altere o workflow:

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:
```

⚠️ **Cuidado**: Isso fará deploy automático a cada push, o que pode causar downtime se houver erros.

## Verificação Final

Checklist para garantir que está funcionando:

- [ ] Secrets configurados no GitHub (SSH_KEY, SSH_USER, SSH_HOST)
- [ ] Chave SSH pública adicionada ao authorized_keys na VPS
- [ ] Teste de conexão SSH funciona
- [ ] Workflow executado com sucesso
- [ ] Containers rodando na VPS após deploy
- [ ] Aplicação acessível pelo domínio

