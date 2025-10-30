#!/bin/sh
set -e

# Wait for MySQL to be available
if [ -n "$DB_HOST" ]; then
  echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."
  for i in $(seq 1 60); do
    nc -z "$DB_HOST" "${DB_PORT:-3306}" && break
    sleep 1
  done
fi

echo "Running migrations..."
node migrate.js

echo "Starting server..."
exec node server.js


