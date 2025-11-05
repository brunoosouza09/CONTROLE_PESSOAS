# 📊 Guia de Monitoramento

## 🎯 Sistema de Logging Implementado

### Arquivos de Log

O sistema cria automaticamente a pasta `logs/` com:

- **`app.log`** - Todos os logs (INFO, WARN, ERROR, HTTP)
- **`error.log`** - Apenas erros (ERROR, FATAL)

### Formato dos Logs

Os logs são salvos em formato JSON:

```json
{
  "timestamp": "2024-11-05T12:00:00.000Z",
  "level": "ERROR",
  "message": "Erro ao criar pessoa",
  "data": {
    "message": "Duplicate entry",
    "code": "ER_DUP_ENTRY"
  }
}
```

## 📈 Endpoints de Monitoramento

### 1. Health Check
```bash
GET /api/health
```

**Resposta:**
```json
{
  "ok": true,
  "timestamp": "2024-11-05T12:00:00.000Z",
  "database": "connected"
}
```

### 2. Métricas (requer autenticação)
```bash
GET /api/metrics
```

**Resposta:**
```json
{
  "timestamp": "2024-11-05T12:00:00.000Z",
  "uptime": 3600,
  "memory": {
    "used": 45,
    "total": 128,
    "external": 2
  },
  "errors": {
    "total": 5,
    "lastError": {
      "timestamp": "2024-11-05T11:30:00.000Z",
      "message": "Erro ao criar pessoa"
    }
  },
  "version": "v18.17.0",
  "platform": "linux"
}
```

## 🔍 Como Ver os Logs

### No Servidor (VPS)

```bash
# Ver todos os logs
tail -f logs/app.log

# Ver apenas erros
tail -f logs/error.log

# Ver últimos 50 erros
tail -50 logs/error.log

# Procurar por erro específico
grep "ERROR" logs/app.log
```

### No Docker

```bash
# Ver logs do container
docker logs controle_pessoas_app

# Ver logs em tempo real
docker logs -f controle_pessoas_app

# Ver logs dos últimos 100 linhas
docker logs --tail 100 controle_pessoas_app
```

## 📊 Integração com Ferramentas de Monitoramento

### Grafana + Prometheus

#### 1. Instalar Prometheus Exporter

```bash
npm install prom-client
```

#### 2. Criar endpoint de métricas Prometheus

```javascript
// routes/prometheus.js
const client = require('prom-client');

const register = new client.Registry();

// Métricas personalizadas
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'route', 'status']
});

register.registerMetric(httpRequestsTotal);

module.exports = { register, httpRequestsTotal };
```

#### 3. Adicionar rota no server.js

```javascript
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});
```

#### 4. Configurar Prometheus

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'cadastro-pessoas'
    static_configs:
      - targets: ['localhost:3000']
```

### LogRocket

#### 1. Instalar LogRocket

```bash
npm install logrocket
```

#### 2. Configurar no server.js

```javascript
const LogRocket = require('logrocket');

if (process.env.LOGROCKET_APP_ID) {
  LogRocket.init(process.env.LOGROCKET_APP_ID);
  
  app.use(LogRocket.requestHandler());
  app.use(LogRocket.errorHandler());
}
```

#### 3. Variável de ambiente

```env
LOGROCKET_APP_ID=seu-app-id
```

### Sentry (Tratamento de Erros)

#### 1. Instalar Sentry

```bash
npm install @sentry/node
```

#### 2. Configurar no server.js

```javascript
const Sentry = require('@sentry/node');

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());
}
```

#### 3. Variável de ambiente

```env
SENTRY_DSN=https://sua-chave@sentry.io/seu-projeto
```

## 🔧 Configuração Avançada

### Níveis de Log

O sistema suporta 5 níveis:

- **INFO** - Informações gerais
- **WARN** - Avisos
- **ERROR** - Erros que não quebram a aplicação
- **FATAL** - Erros críticos
- **HTTP** - Requisições HTTP

### Personalizar Logging

Edite `utils/logger.js` para:

- Adicionar novos níveis
- Mudar formato de saída
- Integrar com serviços externos
- Filtrar logs sensíveis

## 📊 Dashboard Básico (Opcional)

### Criar endpoint de dashboard

```javascript
app.get('/api/dashboard', requireAuth, async (req, res) => {
  const stats = {
    totalPessoas: await contarPessoas(),
    errosHoje: await contarErrosHoje(),
    uptime: process.uptime()
  };
  res.json(stats);
});
```

## 🚨 Alertas

### Configurar alertas por email

```javascript
// utils/alerts.js
const nodemailer = require('nodemailer');

async function enviarAlertaErro(erro) {
  // Configurar email e enviar
}
```

## 📝 Boas Práticas

1. **Não logar senhas** - Sempre filtrar dados sensíveis
2. **Rotacionar logs** - Limpar logs antigos periodicamente
3. **Monitorar disco** - Logs podem crescer muito
4. **Níveis apropriados** - Use INFO para normal, ERROR para problemas

## 🔒 Segurança

- Endpoint `/api/metrics` requer autenticação
- Logs não devem conter dados sensíveis
- Considere criptografar logs em produção

## 📚 Próximos Passos

- [ ] Configurar rotação de logs
- [ ] Integrar com Grafana
- [ ] Adicionar alertas por email
- [ ] Dashboard de métricas
- [ ] Análise de performance

