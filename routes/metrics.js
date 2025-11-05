// Endpoint de Métricas para Monitoramento
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Ler logs e gerar métricas básicas
const getMetrics = (req, res) => {
  try {
    const logsDir = path.join(__dirname, '..', 'logs');
    const errorLogPath = path.join(logsDir, 'error.log');
    
    let errorCount = 0;
    let lastError = null;

    if (fs.existsSync(errorLogPath)) {
      const errorLogs = fs.readFileSync(errorLogPath, 'utf8')
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(log => log !== null);

      errorCount = errorLogs.length;
      lastError = errorLogs[errorLogs.length - 1] || null;
    }

    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      errors: {
        total: errorCount,
        lastError: lastError ? {
          timestamp: lastError.timestamp,
          message: lastError.message
        } : null
      },
      version: process.version,
      platform: process.platform
    };

    res.json(metrics);
  } catch (err) {
    logger.error('Erro ao gerar métricas', err);
    res.status(500).json({ error: 'Erro ao gerar métricas' });
  }
};

module.exports = { getMetrics };

