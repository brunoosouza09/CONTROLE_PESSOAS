# 🔔 Uptime Kuma - Monitoramento de Disponibilidade

## ✅ Configuração Completa

O Uptime Kuma foi adicionado ao `docker-compose.yml` e está configurado para rodar na porta **3002**.

## 🚀 Como Iniciar na VPS

### 1. Atualizar o docker-compose.yml

```bash
cd ~/CONTROLE_PESSOAS
git pull
```

### 2. Iniciar o Uptime Kuma

```bash
docker compose up -d uptime-kuma
```

### 3. Verificar se está rodando

```bash
docker ps | grep uptime-kuma
```

### 4. Acessar o Uptime Kuma

Abra no navegador:
```
http://SEU_IP_VPS:3002
```

Ou se você tem domínio:
```
http://seu-dominio.com:3002
```

## 📝 Primeira Configuração

### 1. Criar Conta Admin

Na primeira vez que acessar:
1. Digite um **Username** (ex: `admin`)
2. Digite uma **Password** (ex: `admin123`)
3. Clique em "Create"

### 2. Adicionar Primeiro Monitor

1. Clique no botão **"+ Add New Monitor"** (canto superior direito)
2. Configure:
   - **Name**: Nome do serviço (ex: "Aplicação Web")
   - **URL**: `http://localhost` ou `http://seu-dominio.com`
   - **Type**: HTTP(s)
   - **Interval**: 60 segundos (padrão)
3. Clique em "Save"

## 📊 Monitorar Serviços

### Monitorar Aplicação Principal

1. **Name**: "Cadastro de Pessoas"
2. **URL**: `http://localhost` ou `http://seu-dominio.com`
3. **Type**: HTTP(s) - Keyword
4. **Keyword**: Pode verificar se a página contém uma palavra específica

### Monitorar Prometheus

1. **Name**: "Prometheus"
2. **URL**: `http://localhost:9090`
3. **Type**: HTTP(s)

### Monitorar Grafana

1. **Name**: "Grafana"
2. **URL**: `http://localhost:3001`
3. **Type**: HTTP(s)

### Monitorar Banco de Dados (MySQL)

1. **Name**: "MySQL"
2. **Host**: `controle_pessoas_mysql`
3. **Port**: `3306`
4. **Type**: TCP Port

## 🔔 Configurar Notificações

### 1. Telegram (Recomendado)

1. Vá em **Settings** → **Notifications**
2. Clique em **"+ Add"**
3. Selecione **"Telegram"**
4. Configure:
   - Crie um bot no Telegram com @BotFather
   - Cole o **Bot Token**
   - Adicione seu **Chat ID**
5. Teste a notificação

### 2. Email

1. Vá em **Settings** → **Notifications**
2. Clique em **"+ Add"**
3. Selecione **"Email (SMTP)"**
4. Configure seu servidor SMTP

## 📈 Status dos Serviços

### Portas em Uso

| Serviço | Porta Externa | Porta Interna | URL |
|---------|--------------|---------------|-----|
| **Aplicação** | 80 | 3000 | `http://SEU_IP_VPS` |
| **Grafana** | 3001 | 3000 | `http://SEU_IP_VPS:3001` |
| **Uptime Kuma** | 3002 | 3001 | `http://SEU_IP_VPS:3002` |
| **Prometheus** | 9090 | 9090 | `http://SEU_IP_VPS:9090` |
| **MySQL** | 3306 | 3306 | (interno) |

## 🔧 Comandos Úteis

### Ver logs do Uptime Kuma

```bash
docker logs -f controle_pessoas_uptime_kuma
```

### Reiniciar Uptime Kuma

```bash
docker compose restart uptime-kuma
```

### Parar Uptime Kuma

```bash
docker compose stop uptime-kuma
```

### Iniciar todos os serviços

```bash
docker compose up -d
```

## 📱 Recursos do Uptime Kuma

- ✅ Monitoramento HTTP/HTTPS
- ✅ Monitoramento TCP
- ✅ Monitoramento de ping
- ✅ Status page pública
- ✅ Notificações (Telegram, Email, Discord, etc.)
- ✅ Histórico de uptime
- ✅ Dashboard bonito e responsivo

## 🔒 Segurança

### Proteger com Autenticação

O Uptime Kuma já tem autenticação por padrão. Certifique-se de:
- Usar uma senha forte
- Não compartilhar credenciais
- Configurar HTTPS se possível (via Nginx reverse proxy)

## 🎯 Próximos Passos

1. ✅ Uptime Kuma configurado na porta 3002
2. ⏳ Acessar e criar conta admin
3. ⏳ Adicionar monitores para seus serviços
4. ⏳ Configurar notificações
5. ⏳ Criar status page pública (opcional)

## 📚 Documentação

- [Uptime Kuma GitHub](https://github.com/louislam/uptime-kuma)
- [Documentação Oficial](https://uptime.kuma.pet/)

