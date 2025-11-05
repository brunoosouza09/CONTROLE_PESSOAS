# Diagnóstico e Solução - Erro 502 Bad Gateway

## 🔍 O que é o erro 502?

O erro 502 Bad Gateway significa que o Nginx (proxy reverso) não consegue se conectar ao servidor da aplicação (app).

## ✅ Solução Passo a Passo

### 1. Verificar Status dos Containers

```bash
cd /root/CONTROLE_PESSOAS
docker compose ps
```

Todos os 3 containers devem estar "Up":
- `controle_pessoas_app` - Up
- `controle_pessoas_mysql` - Up (healthy)
- `controle_pessoas_nginx` - Up

### 2. Verificar Logs do App

```bash
docker compose logs app --tail=50
```

Procure por erros, especialmente:
- Erros de conexão com MySQL
- Erros de módulos não encontrados (bcrypt, express-session)
- Erros de porta

### 3. Verificar se o App está Respondendo

```bash
# Testar diretamente na porta 3000
docker exec controle_pessoas_app curl http://localhost:3000/api/health

# Ou de fora do container
curl http://localhost:3000/api/health
```

### 4. Verificar Logs do Nginx

```bash
docker compose logs nginx --tail=30
```

### 5. Reiniciar Todos os Containers

```bash
cd /root/CONTROLE_PESSOAS
docker compose restart
sleep 10
docker compose ps
```

### 6. Se Ainda Não Funcionar - Reconstruir

```bash
cd /root/CONTROLE_PESSOAS
docker compose down
docker compose up -d --build
sleep 15

# Verificar logs
docker compose logs app --tail=50
```

## 🔧 Problemas Comuns

### Problema 1: App não está rodando
**Solução:** Verificar logs e reiniciar

### Problema 2: Dependências não instaladas
**Solução:**
```bash
docker exec controle_pessoas_app npm install
docker compose restart app
```

### Problema 3: Erro de conexão com MySQL
**Solução:**
```bash
# Verificar se MySQL está saudável
docker exec controle_pessoas_mysql mysqladmin ping -h localhost -proot

# Verificar variáveis de ambiente
docker exec controle_pessoas_app env | grep DB_
```

### Problema 4: Nginx não encontra o app
**Solução:** Verificar nginx.conf e rede Docker

```bash
# Verificar se o app está acessível pelo nome do serviço
docker exec controle_pessoas_nginx ping controle_pessoas_app
```

## 🎯 Solução Rápida (Tudo de Uma Vez)

```bash
cd /root/CONTROLE_PESSOAS && \
docker compose down && \
docker compose up -d --build && \
sleep 20 && \
docker exec controle_pessoas_app npm install && \
docker compose restart && \
sleep 10 && \
docker compose ps && \
docker compose logs app --tail=20
```

## 📝 Verificação Final

Após executar, verifique:

1. **Containers rodando:**
   ```bash
   docker compose ps
   ```

2. **App respondendo:**
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **Nginx funcionando:**
   ```bash
   curl http://localhost
   ```

4. **Acessar pelo domínio:**
   - `http://cdp.controlepessoas.kinghost.net/login.html`

