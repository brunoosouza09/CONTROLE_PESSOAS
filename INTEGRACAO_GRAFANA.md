# 📊 Guia Completo - Integração com Grafana

## 🎯 Visão Geral

Este guia mostra como integrar seu sistema de cadastro de pessoas com **Grafana** usando **Prometheus** para coletar métricas.

**Arquitetura:**
```
Aplicação Node.js → Endpoint /metrics → Prometheus → Grafana
```

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Acesso à VPS onde a aplicação está rodando
- Porta 9090 livre (Prometheus)
- Porta 3001 livre (Grafana)

---

## 🚀 Passo 1: Instalar Dependência Prometheus

A dependência já foi adicionada ao projeto. Se precisar reinstalar:

```bash
npm install prom-client
```

---

## 🚀 Passo 2: Configurar Prometheus no Docker

### 2.1 Criar arquivo `prometheus.yml`

Crie o arquivo `prometheus.yml` na raiz do projeto:

```yaml
global:
  scrape_interval: 15s  # Coletar métricas a cada 15 segundos
  evaluation_interval: 15s
  external_labels:
    monitor: 'cadastro-pessoas'

# Configurações de scraping
scrape_configs:
  - job_name: 'cadastro-pessoas'
    static_configs:
      - targets: ['controle_pessoas_app:3000']  # Nome do serviço Docker
    metrics_path: '/metrics'
    scrape_interval: 15s
```

### 2.2 Atualizar `docker-compose.yml`

Adicione os serviços Prometheus e Grafana:

```yaml
services:
  # ... seus serviços existentes (app, mysql, nginx) ...

  prometheus:
    image: prom/prometheus:latest
    container_name: controle_pessoas_prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    ports:
      - "9090:9090"
    networks:
      - controle_pessoas_network
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: controle_pessoas_grafana
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin123
      - GF_USERS_ALLOW_SIGN_UP=false
    networks:
      - controle_pessoas_network
    depends_on:
      - prometheus
    restart: unless-stopped

volumes:
  # ... seus volumes existentes ...
  prometheus_data:
  grafana_data:

networks:
  controle_pessoas_network:
    driver: bridge
```

---

## 🚀 Passo 3: Deploy na VPS

### 3.1 Copiar arquivos para VPS

```bash
# Na sua VPS
cd ~/CONTROLE_PESSOAS

# Copiar prometheus.yml
# (ou criar via SSH)

# Atualizar docker-compose.yml
# (ou fazer git pull se já commitou)
```

### 3.2 Iniciar serviços

```bash
# Parar containers existentes
docker compose down

# Iniciar todos os serviços (incluindo Prometheus e Grafana)
docker compose up -d

# Verificar se estão rodando
docker compose ps
```

### 3.3 Verificar se Prometheus está coletando

```bash
# Acessar endpoint de métricas da aplicação
curl http://localhost:3000/metrics

# Verificar se Prometheus está acessando
curl http://localhost:9090/api/v1/targets
```

---

## 🚀 Passo 4: Configurar Grafana

### 4.1 Acessar Grafana

1. Abra no navegador: `http://SEU_IP_VPS:3001`
2. Login: `admin` / Senha: `admin123`
3. Você será solicitado a alterar a senha (opcional)

### 4.2 Adicionar Data Source (Prometheus)

1. Vá em **Configuration** → **Data Sources**
2. Clique em **Add data source**
3. Selecione **Prometheus**
4. Configure:
   - **URL**: `http://prometheus:9090` (nome do container)
   - Clique em **Save & Test**
   - Deve aparecer: "Data source is working"

### 4.3 Criar Dashboard Básico

1. Vá em **Dashboards** → **New Dashboard**
2. Clique em **Add visualization**
3. Selecione a data source **Prometheus**

#### **Gráfico 1: Requisições HTTP por segundo**

**Query:**
```promql
rate(http_requests_total[5m])
```

**Configurações:**
- **Legend**: `{{method}} {{route}}`
- **Panel Title**: "Requisições HTTP por Segundo"

#### **Gráfico 2: Duração das Requisições**

**Query:**
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

**Configurações:**
- **Unit**: seconds
- **Panel Title**: "Tempo de Resposta (p95)"

#### **Gráfico 3: Total de Erros**

**Query:**
```promql
sum(rate(errors_total[5m])) by (type)
```

**Configurações:**
- **Panel Title**: "Erros por Tipo"
- **Visualization**: Bar chart

#### **Gráfico 4: Uso de Memória**

**Query:**
```promql
process_resident_memory_bytes / 1024 / 1024
```

**Configurações:**
- **Unit**: MB
- **Panel Title**: "Uso de Memória"

#### **Gráfico 5: Queries do Banco de Dados**

**Query:**
```promql
rate(db_queries_total[5m]) by (operation)
```

**Configurações:**
- **Panel Title**: "Queries do Banco por Operação"

#### **Gráfico 6: Conexões do Banco**

**Query:**
```promql
db_connections_active
```

**Configurações:**
- **Panel Title**: "Conexões Ativas do Banco"

#### **Gráfico 7: Usuários Ativos**

**Query:**
```promql
active_users
```

**Configurações:**
- **Panel Title**: "Usuários Ativos (Sessões)"

### 4.4 Salvar Dashboard

1. Clique em **Save** (ícone de disco)
2. Nome: "Cadastro de Pessoas - Monitoramento"
3. Clique em **Save**

---

## 📊 Métricas Disponíveis

### Métricas HTTP

- `http_requests_total` - Total de requisições
- `http_request_duration_seconds` - Duração das requisições

### Métricas de Banco

- `db_connections_active` - Conexões ativas
- `db_queries_total` - Total de queries

### Métricas de Erros

- `errors_total` - Total de erros por tipo

### Métricas de Sistema

- `process_resident_memory_bytes` - Memória usada
- `process_cpu_user_seconds_total` - CPU usado
- `nodejs_heap_size_total_bytes` - Heap do Node.js

### Métricas Customizadas

- `active_users` - Usuários ativos (sessões)

---

## 🎨 Dashboard JSON Completo

Você pode importar este dashboard completo:

1. Vá em **Dashboards** → **Import**
2. Cole o JSON abaixo
3. Clique em **Load**

```json
{
  "dashboard": {
    "title": "Cadastro de Pessoas - Monitoramento",
    "panels": [
      {
        "title": "Requisições HTTP por Segundo",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Tempo de Resposta (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ],
        "type": "graph",
        "yaxes": [{"format": "s"}]
      },
      {
        "title": "Erros por Tipo",
        "targets": [
          {
            "expr": "sum(rate(errors_total[5m])) by (type)"
          }
        ],
        "type": "bargraph"
      },
      {
        "title": "Uso de Memória",
        "targets": [
          {
            "expr": "process_resident_memory_bytes / 1024 / 1024"
          }
        ],
        "type": "graph",
        "yaxes": [{"format": "MB"}]
      }
    ]
  }
}
```

---

## 🔧 Troubleshooting

### Prometheus não está coletando métricas

1. Verificar se o endpoint `/metrics` está acessível:
   ```bash
   curl http://localhost:3000/metrics
   ```

2. Verificar targets no Prometheus:
   ```bash
   curl http://localhost:9090/api/v1/targets
   ```

3. Verificar logs do Prometheus:
   ```bash
   docker logs controle_pessoas_prometheus
   ```

### Grafana não encontra Prometheus

1. Verificar se ambos estão na mesma rede Docker:
   ```bash
   docker network inspect controle_pessoas_network
   ```

2. No Grafana, usar o nome do container: `http://prometheus:9090`

### Métricas não aparecem

1. Aguardar alguns minutos (scrape interval é 15s)
2. Verificar se há dados no Prometheus:
   ```bash
   curl 'http://localhost:9090/api/v1/query?query=up'
   ```

---

## 🔒 Segurança

### Expor Grafana com HTTPS (Recomendado)

1. Configure Nginx como reverse proxy para Grafana
2. Adicione autenticação básica
3. Use certificado SSL (Let's Encrypt)

### Exemplo Nginx para Grafana:

```nginx
server {
    listen 80;
    server_name grafana.seu-dominio.com;

    location / {
        proxy_pass http://grafana:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📈 Próximos Passos

1. **Alertas no Grafana**: Configure alertas quando:
   - Erros > 10 por minuto
   - Tempo de resposta > 2 segundos
   - Memória > 80%

2. **Dashboards Avançados**: Crie dashboards específicos para:
   - Performance de queries
   - Análise de erros
   - Uso de recursos

3. **Loki para Logs**: Integre Loki para visualizar logs no Grafana

---

## 📚 Recursos Úteis

- [Documentação Prometheus](https://prometheus.io/docs/)
- [Documentação Grafana](https://grafana.com/docs/)
- [PromQL Query Language](https://prometheus.io/docs/prometheus/latest/querying/basics/)

---

## ✅ Checklist de Implementação

- [ ] Dependência `prom-client` instalada
- [ ] Endpoint `/metrics` funcionando
- [ ] `prometheus.yml` criado
- [ ] `docker-compose.yml` atualizado
- [ ] Prometheus rodando e coletando
- [ ] Grafana rodando e conectado ao Prometheus
- [ ] Dashboard criado com métricas básicas
- [ ] Alertas configurados (opcional)

