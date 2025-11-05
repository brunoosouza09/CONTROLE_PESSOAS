// Exporter Prometheus para métricas
const client = require('prom-client');

// Criar registro de métricas
const register = new client.Registry();

// Coletar métricas padrão do Node.js
client.collectDefaultMetrics({ register });

// Métricas personalizadas da aplicação
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register]
});

const dbConnectionsActive = new client.Gauge({
  name: 'db_connections_active',
  help: 'Número de conexões ativas no banco de dados',
  registers: [register]
});

const dbQueriesTotal = new client.Counter({
  name: 'db_queries_total',
  help: 'Total de queries executadas no banco de dados',
  labelNames: ['operation'],
  registers: [register]
});

const errorsTotal = new client.Counter({
  name: 'errors_total',
  help: 'Total de erros na aplicação',
  labelNames: ['type', 'endpoint'],
  registers: [register]
});

const activeUsers = new client.Gauge({
  name: 'active_users',
  help: 'Número de usuários ativos (sessões)',
  registers: [register]
});

// Middleware para capturar métricas HTTP
const metricsMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const route = req.route ? req.route.path : req.path;

  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000;
    const status = res.statusCode;

    httpRequestsTotal.inc({
      method: req.method,
      route: route,
      status: status
    });

    httpRequestDuration.observe({
      method: req.method,
      route: route,
      status: status
    }, duration);
  });

  next();
};

// Função para registrar erro
const recordError = (type, endpoint) => {
  errorsTotal.inc({ type, endpoint });
};

// Função para atualizar conexões do banco
const updateDbConnections = (count) => {
  dbConnectionsActive.set(count);
};

// Função para registrar query do banco
const recordDbQuery = (operation) => {
  dbQueriesTotal.inc({ operation });
};

// Função para atualizar usuários ativos
const updateActiveUsers = (count) => {
  activeUsers.set(count);
};

// Endpoint para Prometheus coletar métricas
const getMetrics = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
};

module.exports = {
  register,
  metricsMiddleware,
  recordError,
  updateDbConnections,
  recordDbQuery,
  updateActiveUsers,
  getMetrics
};

