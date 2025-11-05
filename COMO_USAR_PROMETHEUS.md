# 📊 Como Usar o Prometheus

## ✅ Arquivo `prometheus.yml` Criado

O arquivo `prometheus.yml` foi criado e configurado para coletar métricas da sua aplicação.

## 📝 Explicação do Arquivo

### Global
- `scrape_interval: 15s` - Coleta métricas a cada 15 segundos
- `evaluation_interval: 15s` - Avalia regras de alerta a cada 15 segundos
- `external_labels` - Labels adicionados a todas as métricas

### Scrape Configs
- `job_name: 'cadastro-pessoas'` - Nome do job de coleta
- `targets: ['controle_pessoas_app:3000']` - Nome do container Docker + porta
- `metrics_path: '/metrics'` - Endpoint onde as métricas estão disponíveis

## 🚀 Como Usar na VPS

### 1. Verificar se o arquivo existe

```bash
cd ~/CONTROLE_PESSOAS
ls -la prometheus.yml
```

### 2. Iniciar Prometheus (se ainda não estiver rodando)

```bash
docker compose up -d prometheus
```

### 3. Verificar se está coletando métricas

```bash
# Ver logs do Prometheus
docker logs controle_pessoas_prometheus

# Verificar targets no Prometheus
curl http://localhost:9090/api/v1/targets
```

### 4. Acessar interface do Prometheus

Abra no navegador: `http://SEU_IP_VPS:9090`

## 🔍 Testar Queries no Prometheus

### Query 1: Verificar se está coletando
```
up
```

### Query 2: Requisições HTTP por segundo
```
rate(http_requests_total[5m])
```

### Query 3: Tempo de resposta (p95)
```
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### Query 4: Total de erros
```
sum(rate(errors_total[5m])) by (type)
```

### Query 5: Uso de memória
```
process_resident_memory_bytes / 1024 / 1024
```

## 🐛 Troubleshooting

### Prometheus não encontra a aplicação

1. **Verificar se o container está rodando:**
   ```bash
   docker ps | grep controle_pessoas_app
   ```

2. **Verificar se o endpoint /metrics está acessível:**
   ```bash
   docker exec controle_pessoas_app curl http://localhost:3000/metrics
   ```

3. **Verificar se estão na mesma rede Docker:**
   ```bash
   docker network inspect controle_pessoas_network
   ```

4. **Ajustar o target no prometheus.yml:**
   - Se o nome do container for diferente, atualize:
   ```yaml
   targets: ['NOME_DO_CONTAINER:3000']
   ```

### Ver logs do Prometheus

```bash
docker logs -f controle_pessoas_prometheus
```

### Reiniciar Prometheus

```bash
docker compose restart prometheus
```

## 📈 Próximos Passos

1. ✅ Arquivo `prometheus.yml` criado
2. ⏳ Prometheus coletando métricas
3. ⏳ Grafana conectado ao Prometheus
4. ⏳ Dashboards criados

## 🔗 Links Úteis

- [Documentação Prometheus](https://prometheus.io/docs/)
- [PromQL Query Language](https://prometheus.io/docs/prometheus/latest/querying/basics/)

