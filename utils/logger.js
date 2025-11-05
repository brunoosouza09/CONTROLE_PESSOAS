// Sistema de Logging Estruturado
const fs = require('fs');
const path = require('path');

// Criar pasta de logs se não existir
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Função para formatar data
const formatDate = () => {
  return new Date().toISOString();
};

// Função para escrever log em arquivo
const writeLog = (level, message, data = null) => {
  const timestamp = formatDate();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data })
  };

  const logLine = JSON.stringify(logEntry) + '\n';

  // Log geral
  fs.appendFileSync(
    path.join(logsDir, 'app.log'),
    logLine,
    { encoding: 'utf8' }
  );

  // Log de erros separado
  if (level === 'ERROR' || level === 'FATAL') {
    fs.appendFileSync(
      path.join(logsDir, 'error.log'),
      logLine,
      { encoding: 'utf8' }
    );
  }

  // Log no console também
  console.log(`[${timestamp}] [${level}] ${message}`, data || '');
};

// Logger API
const logger = {
  info: (message, data) => writeLog('INFO', message, data),
  warn: (message, data) => writeLog('WARN', message, data),
  error: (message, error) => writeLog('ERROR', message, {
    message: error?.message,
    stack: error?.stack,
    code: error?.code
  }),
  fatal: (message, error) => writeLog('FATAL', message, {
    message: error?.message,
    stack: error?.stack,
    code: error?.code
  }),
  http: (req, res, responseTime) => {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      responseTime: `${responseTime}ms`
    };
    writeLog('HTTP', `${req.method} ${req.url} - ${res.statusCode}`, logData);
  }
};

module.exports = logger;

