#!/bin/sh
set -e

# Wait for MySQL to be available using TCP check
if [ -n "$DB_HOST" ]; then
  echo "Waiting for MySQL at $DB_HOST:${DB_PORT:-3306}..."
  max_attempts=60
  attempt=0
  
  while [ $attempt -lt $max_attempts ]; do
    if nc -z "$DB_HOST" "${DB_PORT:-3306}" 2>/dev/null; then
      echo "MySQL is ready!"
      break
    fi
    attempt=$((attempt + 1))
    echo "Waiting for MySQL... ($attempt/$max_attempts)"
    sleep 2
  done
  
  if [ $attempt -eq $max_attempts ]; then
    echo "ERROR: MySQL did not become available in time" >&2
    exit 1
  fi
  
  # Additional wait to ensure MySQL is fully ready
  sleep 2
fi

echo "Running migrations..."
node migrate.js

echo "Starting server..."
exec node server.js


