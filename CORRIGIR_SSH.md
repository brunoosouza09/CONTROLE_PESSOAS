# 🔧 Corrigir Erro de Permissão SSH

## Erro Identificado
```
Permission denied (publickey, password)
```

Isso significa que a chave SSH não está autorizada no servidor.

## Solução: Autorizar a Chave na VPS

### Passo 1: Conectar na VPS
```bash
ssh root@191.252.214.59
```

### Passo 2: Verificar/Adicionar Chave Pública ao authorized_keys
```bash
# Verificar se a chave existe
ls -la ~/.ssh/github_actions.pub

# Se não existir, criar nova chave
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions -N ""

# Adicionar chave pública ao authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Verificar se foi adicionado
tail -5 ~/.ssh/authorized_keys

# Ajustar permissões (importante!)
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/github_actions
```

### Passo 3: Copiar Chave Privada para o GitHub
```bash
# Mostrar a chave PRIVADA (copie tudo)
cat ~/.ssh/github_actions
```

Depois:
1. Vá para: https://github.com/brunoosouza09/CONTROLE_PESSOAS/settings/secrets/actions
2. Edite o secret `CLOUD_SSH_KEY`
3. Cole a chave PRIVADA completa (desde `-----BEGIN` até `-----END`)
4. Salve

### Passo 4: Testar Conexão
```bash
# Na VPS, testar se a chave funciona
ssh -i ~/.ssh/github_actions root@localhost echo "Teste OK"
```

## Verificação Rápida

Execute na VPS para verificar tudo:
```bash
# Verificar se a chave pública está autorizada
grep -f ~/.ssh/github_actions.pub ~/.ssh/authorized_keys

# Se não aparecer nada, adicione:
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
```

## Se Ainda Não Funcionar

1. Verifique se o serviço SSH está rodando:
```bash
systemctl status ssh
```

2. Verifique se a porta 22 está aberta:
```bash
netstat -tlnp | grep :22
```

3. Teste a conexão localmente:
```bash
ssh -i ~/.ssh/github_actions root@localhost echo "OK"
```

