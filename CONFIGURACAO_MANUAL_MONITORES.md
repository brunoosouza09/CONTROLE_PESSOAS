# 🔔 Configuração Manual de Monitores - Uptime Kuma

## 📋 Guia Completo de Configuração Manual

## 📋 Passo a Passo Detalhado

### 1. Aplicação Web Principal

1. No Uptime Kuma, clique em **"+ Add New Monitor"** (canto superior direito)
2. Preencha:
   - **Name**: `Aplicação Web`
   - **URL**: `http://localhost` (ou `http://191.252.214.59`)
   - **Type**: Selecione `HTTP(s)`
   - **Interval**: `60` segundos
   - **Max retries**: `3`
   - **Retry interval**: `60` segundos
3. Clique em **"Save"**

### 2. Grafana

1. Clique em **"+ Add New Monitor"**
2. Preencha:
   - **Name**: `Grafana`
   - **URL**: `http://localhost:3001`
   - **Type**: `HTTP(s)`
   - **Interval**: `60` segundos
3. Clique em **"Save"**

### 3. Prometheus

1. Clique em **"+ Add New Monitor"**
2. Preencha:
   - **Name**: `Prometheus`
   - **URL**: `http://localhost:9090`
   - **Type**: `HTTP(s)`
   - **Interval**: `60` segundos
3. Clique em **"Save"**

### 4. Uptime Kuma (Auto-monitoramento)

1. Clique em **"+ Add New Monitor"**
2. Preencha:
   - **Name**: `Uptime Kuma`
   - **URL**: `http://localhost:3002`
   - **Type**: `HTTP(s)`
   - **Interval**: `60` segundos
3. Clique em **"Save"**

### 5. MySQL (TCP Port)

1. Clique em **"+ Add New Monitor"**
2. Preencha:
   - **Name**: `MySQL`
   - **Type**: Selecione `TCP Port`
   - **Hostname**: `controle_pessoas_mysql`
   - **Port**: `3306`
   - **Interval**: `60` segundos
3. Clique em **"Save"**

### 6. Nginx (TCP Port)

1. Clique em **"+ Add New Monitor"**
2. Preencha:
   - **Name**: `Nginx`
   - **Type**: Selecione `TCP Port`
   - **Hostname**: `localhost`
   - **Port**: `80`
   - **Interval**: `60` segundos
3. Clique em **"Save"**

## 🔍 Verificar se Funcionou

Após criar os monitores, você verá:

- ✅ **Verde**: Serviço online e funcionando
- ❌ **Vermelho**: Serviço offline ou com erro
- ⏳ **Cinza**: Ainda verificando (primeira vez)

## 📊 Visualização

No dashboard principal do Uptime Kuma, você verá todos os monitores listados com:
- Status atual (online/offline)
- Tempo de resposta
- Última verificação
- Histórico de uptime

## 🎯 Dica: Monitorar com Keyword

Para verificar se a página realmente está funcionando (não só respondendo):

1. Ao criar monitor HTTP, selecione **"HTTP(s) - Keyword"**
2. Adicione uma **Keyword**: `Cadastro` (ou qualquer texto que aparece na sua página)
3. Isso verifica se a página contém o texto esperado

## 🔔 Próximo Passo: Notificações

Depois de configurar os monitores, configure notificações:

1. Vá em **Settings** → **Notifications**
2. Adicione Telegram, Email ou Discord
3. Associe aos monitores

## ✅ Checklist

- [ ] Aplicação Web monitorada
- [ ] Grafana monitorado
- [ ] Prometheus monitorado
- [ ] Uptime Kuma monitorado
- [ ] MySQL monitorado
- [ ] Nginx monitorado
- [ ] Todos mostrando status verde ✅

