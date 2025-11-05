# 🔧 Troubleshooting - Deploy GitHub Actions

## ❌ Erro: "Process completed with exit code 1"

Este erro indica que uma etapa do workflow falhou. Veja abaixo como identificar e corrigir.

## 🔍 Como Verificar o Erro

1. Acesse: `https://github.com/brunoosouza09/CONTROLE_PESSOAS/actions`
2. Clique no workflow que falhou (vermelho)
3. Clique na etapa que falhou
4. Veja os logs para identificar o problema

## 🐛 Problemas Comuns e Soluções

### 1. Testes Falhando

**Sintoma**: Erro na etapa "Executar testes"

**Solução**: 
- Os testes agora são não-bloqueantes (continuam mesmo se falharem)
- Para corrigir os testes, execute localmente:
  ```bash
  npm test
  ```

### 2. Secrets Não Configurados

**Sintoma**: Erro na etapa "Verificar e configurar secrets"

**Erros possíveis**:
- `❌ Secret SSH_KEY/CLOUD_SSH_KEY não configurado`
- `❌ Secret SSH_HOST/CLOUD_HOST não configurado`

**Solução**:
1. Vá em: **Settings** → **Secrets and variables** → **Actions**
2. Verifique se existem:
   - `CLOUD_SSH_KEY` ou `SSH_KEY`
   - `CLOUD_HOST` ou `SSH_HOST`
   - `CLOUD_USER` ou `SSH_USER` (opcional, padrão: root)

### 3. Falha na Conexão SSH

**Sintoma**: Erro "Permission denied" ou "Connection refused"

**Solução**:
1. Verifique se a chave SSH está correta:
   ```bash
   # Na VPS, verifique se a chave pública está em authorized_keys
   cat ~/.ssh/authorized_keys
   ```

2. Teste conexão manualmente:
   ```bash
   ssh -i ~/.ssh/github_actions root@191.252.214.59
   ```

### 4. Git Pull Falhou

**Sintoma**: Erro "❌ Falha no git pull"

**Solução na VPS**:
```bash
cd ~/CONTROLE_PESSOAS
git status
git reset --hard origin/main
git pull origin main
```

### 5. Docker Compose Falhou

**Sintoma**: Erro "❌ Falha ao iniciar containers"

**Solução na VPS**:
```bash
cd ~/CONTROLE_PESSOAS
docker compose down
docker compose up -d --build
docker compose logs app
```

### 6. Porta Já em Uso

**Sintoma**: Erro "port is already allocated"

**Solução**:
```bash
# Verificar qual processo está usando a porta
docker ps
# Parar containers conflitantes
docker compose down
# Reiniciar
docker compose up -d
```

## ✅ Checklist de Verificação

Antes de fazer deploy, verifique:

- [ ] Secrets configurados no GitHub
- [ ] Chave SSH pública adicionada na VPS
- [ ] Testes passando localmente (opcional)
- [ ] Docker funcionando na VPS
- [ ] Git funcionando na VPS

## 🔄 Reexecutar Deploy

### Opção 1: Push Novamente

Faça um pequeno commit e push:
```bash
git commit --allow-empty -m "trigger deploy"
git push origin main
```

### Opção 2: Manual no GitHub

1. Acesse: `https://github.com/brunoosouza09/CONTROLE_PESSOAS/actions`
2. Clique em "Deploy com Docker"
3. Clique em "Run workflow"
4. Selecione branch "main"
5. Execute

## 📊 Ver Logs Detalhados

No GitHub Actions, cada etapa mostra logs. Clique na etapa que falhou para ver detalhes completos.

## 🆘 Se Nada Funcionar

1. Verifique logs na VPS:
   ```bash
   cd ~/CONTROLE_PESSOAS
   docker compose logs
   ```

2. Verifique status dos containers:
   ```bash
   docker compose ps
   ```

3. Tente deploy manual na VPS:
   ```bash
   cd ~/CONTROLE_PESSOAS
   git pull origin main
   docker compose down
   docker compose up -d --build
   ```

