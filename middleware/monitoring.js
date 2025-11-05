// Middleware de Monitoramento e Logging
const logger = require('../utils/logger');

// Middleware para log de requisições HTTP
const httpLogger = (req, res, next) => {
  const startTime = Date.now();

  // Interceptar o fim da resposta
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    logger.http(req, res, responseTime);
  });

  next();
};

// Middleware para capturar erros não tratados
const errorHandler = (err, req, res, next) => {
  // Log do erro
  logger.error('Erro não tratado na API', err);

  // Resposta ao cliente
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Erro interno do servidor' 
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

// Middleware para capturar erros 404
const notFoundHandler = (req, res) => {
  logger.warn(`Rota não encontrada: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Rota não encontrada' });
};

// Middleware para capturar requisições não autenticadas
const authLogger = (req, res, next) => {
  if (req.path.startsWith('/api/') && !req.path.startsWith('/api/login') && !req.path.startsWith('/api/health')) {
    if (!req.session || !req.session.userId) {
      logger.warn('Tentativa de acesso não autenticado', {
        path: req.path,
        method: req.method,
        ip: req.ip
      });
    }
  }
  next();
};

module.exports = {
  httpLogger,
  errorHandler,
  notFoundHandler,
  authLogger
};

