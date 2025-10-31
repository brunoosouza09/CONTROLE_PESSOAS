# ---------- Build stage ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ---------- Runtime stage ----------
FROM node:20-alpine
RUN apk add --no-cache netcat-openbsd
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Default envs (override in compose/.env)
ENV PORT=3000 \
    DB_PORT=3306

EXPOSE 3000

# Entrypoint runs migration then starts server
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]


