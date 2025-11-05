# 🔔 Como Configurar Monitores do Uptime Kuma

## 🎯 Monitoramento Automático dos Containers

Este guia mostra como configurar monitores para todos os seus containers Docker.

## 📋 Containers para Monitorar

| Container | Tipo | URL/Endpoint | Porta |
|-----------|------|--------------|-------|
| **Aplicação Web** | HTTP | `http://localhost` | 80 |
| **Grafana** | HTTP | `http://localhost:3001` | 3001 |
| **Prometheus** | HTTP | `http://localhost:9090` | 9090 |
| **Uptime Kuma** | HTTP | `http://localhost:3002` | 3002 |
| **MySQL** | TCP | `controle_pessoas_mysql:3306` | 3306 |
| **Nginx** | TCP | `localhost:80` | 80 |

## 🚀 Método 1: Configuração Manual (Recomendado)

### 1. Aplicação Web Principal

1. Clique em **"+ Add New Monitor"**
2. Configure:
   - **Name**: `Aplicação Web`
   - **URL**: `http://localhost` (ou `http://seu-dominio.com`)
   - **Type**: `HTTP(s)`
   - **Interval**: `60` segundos
   - **Max retries**: `3`
3. Clique em **"Save"**

### 2. Grafana

1. Clique em **"+ Add New Monitor"**
2. Configure:
   - **Name**: `Grafana`
   - **URL**: `http://localhost:3001`
   - **Type**: `HTTP(s)`
   - **Interval**: `60` segundos
3. Clique em **"Save"**

### 3. Prometheus

1. Clique em **"+ Add New Monitor"**
2. Configure:
   - **Name**: `Prometheus`
   - **URL**: `http://localhost:9090`
   - **Type**: `HTTP(s)`
   - **Interval**: `60` segundos
3. Clique em **"Save"**

### 4. Uptime Kuma (Auto-monitoramento)

1. Clique em **"+ Add New Monitor"**
2. Configure:
   - **Name**: `Uptime Kuma`
   - **URL**: `http://localhost:3002`
   - **Type**: `HTTP(s)`
   - **Interval**: `60` segundos
3. Clique em **"Save"**

### 5. MySQL (TCP)

1. Clique em **"+ Add New Monitor"**
2. Configure:
   - **Name**: `MySQL`
   - **Hostname**: `controle_pessoas_mysql`
   - **Port**: `3306`
   - **Type**: `TCP Port`
   - **Interval**: `60` segundos
3. Clique em **"Save"**

### 6. Nginx (TCP)

1. Clique em **"+ Add New Monitor"**
2. Configure:
   - **Name**: `Nginx`
   - **Hostname**: `localhost`
   - **Port**: `80`
   - **Type**: `TCP Port`
   - **Interval**: `60` segundos
3. Clique em **"Save"**

## 🤖 Método 2: Script Automático (Avançado)

### 1. Tornar o script executável

```bash
chmod +x scripts/configurar-monitores-uptime-kuma.sh
```

### 2. Executar o script

```bash
cd ~/CONTROLE_PESSOAS
./scripts/configurar-monitores-uptime-kuma.sh
```

### 3. Informar credenciais

O script pedirá:
- Username: `admin` (ou o que você configurou)
- Password: (a senha que você criou)

## 📊 Configurações Avançadas

### Monitoramento com Keyword

Para verificar se a página contém um texto específico:

1. **Type**: `HTTP(s) - Keyword`
2. **Keyword**: `Cadastro` (ou qualquer texto da página)
3. Isso verifica se a página está realmente funcionando

### Monitoramento de Container via Docker Socket

Para monitorar containers diretamente (requer configuração adicional):

1. Instale o plugin "Docker" no Uptime Kuma
2. Configure acesso ao Docker socket
3. Monitore containers por status

## 🔔 Configurar Notificações

### 1. Telegram (Recomendado)

1. Vá em **Settings** → **Notifications**
2. Clique em **"+ Add"**
3. Selecione **"Telegram"**
4. Configure:
   - Crie um bot com [@BotFather](https://t.me/BotFather)
   - Cole o **Bot Token**
   - Adicione seu **Chat ID** (use [@userinfobot](https://t.me/userinfobot))
5. Teste a notificação

### 2. Email

1. Vá em **Settings** → **Notifications**
2. Clique em **"+ Add"**
3. Selecione **"Email (SMTP)"**
4. Configure seu servidor SMTP

### 3. Associar Notificação aos Monitores

1. Edite cada monitor
2. Em **"Notification"**, selecione as notificações desejadas
3. Salve

## 📈 Status Page Pública

### Criar Status Page

1. Vá em **Settings** → **Status Page**
2. Clique em **"+ Add Status Page"**
3. Configure:
   - **Title**: "Status dos Serviços"
   - **Description**: "Monitoramento de disponibilidade"
   - Selecione os monitores que deseja exibir publicamente
4. Salve

### Compartilhar Link

O Status Page terá um link público que você pode compartilhar:
```
http://SEU_IP_VPS:3002/status/page-name
```

## 🔍 Verificar Status

Após configurar, você verá:

- ✅ **Verde**: Serviço online
- ❌ **Vermelho**: Serviço offline
- ⚠️ **Amarelo**: Aviso/recuperação

## 🐛 Troubleshooting

### Monitor não está funcionando

1. Verifique se o container está rodando:
   ```bash
   docker ps | grep nome_do_container
   ```

2. Teste a conexão manualmente:
   ```bash
   curl http://localhost:3001  # Para Grafana
   curl http://localhost:9090   # Para Prometheus
   ```

3. Verifique logs do container:
   ```bash
   docker logs controle_pessoas_app
   ```

### TCP Port não funciona

- Para MySQL, use o nome do container: `controle_pessoas_mysql:3306`
- Certifique-se de que os containers estão na mesma rede Docker

## 📚 Recursos Adicionais

- [Documentação Uptime Kuma](https://github.com/louislam/uptime-kuma)
- [Lista de Notificações Suportadas](https://github.com/louislam/uptime-kuma/wiki/Notifications)

## ✅ Checklist

- [ ] Monitor da Aplicação Web configurado
- [ ] Monitor do Grafana configurado
- [ ] Monitor do Prometheus configurado
- [ ] Monitor do Uptime Kuma configurado
- [ ] Monitor do MySQL configurado
- [ ] Monitor do Nginx configurado
- [ ] Notificações configuradas
- [ ] Status Page criado (opcional)

