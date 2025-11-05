# 📊 Como Importar Dashboard no Grafana

## 🎯 Dashboard Completo Pronto

Criei um dashboard JSON completo com 7 painéis de monitoramento:
1. ✅ Requisições HTTP por Segundo
2. ✅ Tempo de Resposta (p95)
3. ✅ Erros por Tipo
4. ✅ Uso de Memória (MB)
5. ✅ Queries do Banco por Operação
6. ✅ Status dos Targets
7. ✅ Total de Requisições HTTP

## 🚀 Como Importar

### Passo 1: Copiar o conteúdo do arquivo

1. Abra o arquivo `grafana-dashboard.json` que foi criado
2. Selecione todo o conteúdo (Ctrl+A)
3. Copie (Ctrl+C)

### Passo 2: Importar no Grafana

1. No Grafana, você está na tela "New dashboard"
2. Clique no botão **"Import dashboard"** (canto inferior direito)
3. Na tela de importação, você verá:
   - Campo para colar JSON
   - Ou botão "Upload JSON file"
   
4. **Opção A - Colar JSON:**
   - Cole o conteúdo do arquivo `grafana-dashboard.json` no campo
   - Clique em "Load"
   
5. **Opção B - Upload de arquivo:**
   - Clique em "Upload JSON file"
   - Selecione o arquivo `grafana-dashboard.json`
   - Clique em "Load"

### Passo 3: Configurar importação

1. Após clicar em "Load", você verá:
   - Nome do dashboard: "Cadastro de Pessoas - Monitoramento"
   - Data source: Selecione "prometheus"
   - Clique em "Import"

### Passo 4: Pronto!

O dashboard será importado e você verá todos os gráficos configurados automaticamente.

## 📋 Alternativa: Criar Manualmente

Se preferir criar manualmente, clique em "Add visualization" e siga estes passos:

### Gráfico 1: Requisições HTTP

1. Clique em "Add visualization"
2. Selecione data source "prometheus"
3. Query: `rate(http_requests_total[5m])`
4. Legend: `{{method}} {{route}}`
5. Clique em "Apply"

### Gráfico 2: Erros

1. Adicione novo painel
2. Query: `sum(rate(errors_total[5m])) by (type)`
3. Visualization: Bar chart
4. Clique em "Apply"

## 🔧 Customizar Dashboard

Após importar, você pode:
- ✅ Editar qualquer painel (clique no título → Edit)
- ✅ Adicionar novos painéis
- ✅ Alterar intervalo de tempo
- ✅ Configurar alertas

## 📊 Queries Disponíveis

### Métricas HTTP
- `rate(http_requests_total[5m])` - Requisições por segundo
- `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` - Tempo p95

### Métricas de Erro
- `sum(rate(errors_total[5m])) by (type)` - Erros por tipo
- `errors_total` - Total de erros

### Métricas de Banco
- `rate(db_queries_total[5m]) by (operation)` - Queries por operação
- `db_connections_active` - Conexões ativas

### Métricas de Sistema
- `process_resident_memory_bytes / 1024 / 1024` - Memória em MB
- `rate(process_cpu_user_seconds_total[5m])` - CPU usado

## ✅ Próximos Passos

1. Importar o dashboard
2. Verificar se os gráficos estão aparecendo
3. Personalizar conforme necessário
4. Configurar alertas (opcional)

