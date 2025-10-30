# ---------- Build stage ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ---------- Runtime stage ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Default envs (override in compose/.env)
ENV PORT=3000 \
    DB_HOST=localhost \
    DB_PORT=3306 \
    DB_USER=root \
    DB_PASSWORD= \
    DB_NAME=cadastro_pessoas

EXPOSE 3000

# Entrypoint runs migration then starts server
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]


