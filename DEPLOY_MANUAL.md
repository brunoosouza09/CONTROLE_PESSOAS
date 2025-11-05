# 🚀 Deploy Manual na VPS

Como o GitHub Actions está com problemas no secret SSH_KEY, vamos fazer o deploy manualmente na VPS.

## Passo a Passo

### 1. Conectar na VPS
```bash
ssh root@191.252.214.59
```

### 2. Executar Deploy
```bash
cd /root/CONTROLE_PESSOAS
git pull origin main
docker compose down
docker compose up -d --build
```

### 3. Aguardar e Verificar
```bash
# Aguardar 15 segundos
sleep 15

# Verificar containers
docker compose ps

# Verificar se o arquivo foi atualizado
docker exec controle_pessoas_app grep "background:" /app/public/login.html | head -1
```

Deve mostrar: `background: #0f172a;`

### 4. Testar no Navegador
1. Limpe o cache (Ctrl + Shift + R)
2. Acesse: http://cdp.controlepessoas.kinghost.net/login.html
3. A tela deve ter fundo escuro

## Resolver GitHub Actions Depois

O problema do GitHub Actions pode ser:
- Secret não foi salvo corretamente
- Secret está em organização ao invés do repositório
- Há caracteres invisíveis na chave

Para resolver depois:
1. Delete o secret SSH_KEY
2. Recrie do zero
3. Cole a chave novamente (sem espaços extras)

