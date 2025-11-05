#!/bin/bash

# Script para configurar monitores do Uptime Kuma via API
# Execute este script na VPS após fazer login no Uptime Kuma

echo "🔔 Configurando monitores do Uptime Kuma..."

# Variáveis (ajuste conforme necessário)
UPTIME_KUMA_URL="http://localhost:3002"
USERNAME="admin"  # Altere se necessário
PASSWORD=""  # Será solicitado

# Solicitar senha
read -sp "Digite a senha do Uptime Kuma: " PASSWORD
echo ""

# Função para fazer login e obter token
login() {
    echo "🔐 Fazendo login..."
    TOKEN=$(curl -s -X POST "$UPTIME_KUMA_URL/api/login" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" \
        | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -z "$TOKEN" ]; then
        echo "❌ Erro ao fazer login. Verifique usuário e senha."
        exit 1
    fi
    
    echo "✅ Login realizado com sucesso"
}

# Função para criar monitor
create_monitor() {
    local name=$1
    local url=$2
    local type=$3
    local interval=${4:-60}
    
    echo "➕ Criando monitor: $name"
    
    response=$(curl -s -X POST "$UPTIME_KUMA_URL/api/monitor" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d "{
            \"name\": \"$name\",
            \"url\": \"$url\",
            \"type\": \"$type\",
            \"interval\": $interval,
            \"retryInterval\": 60,
            \"maxretries\": 3,
            \"expiryNotification\": true,
            \"ignoreTls\": false
        }")
    
    if echo "$response" | grep -q "monitorID"; then
        echo "✅ Monitor '$name' criado com sucesso"
    else
        echo "⚠️  Erro ao criar monitor '$name': $response"
    fi
}

# Login
login

# Monitores HTTP
echo ""
echo "📊 Criando monitores HTTP..."

create_monitor "Aplicação Web" "http://localhost" "http" 60
create_monitor "Grafana" "http://localhost:3001" "http" 60
create_monitor "Prometheus" "http://localhost:9090" "http" 60
create_monitor "Uptime Kuma" "http://localhost:3002" "http" 60

# Monitores TCP
echo ""
echo "🔌 Criando monitores TCP..."

create_monitor "MySQL" "controle_pessoas_mysql:3306" "tcp" 60
create_monitor "Nginx" "localhost:80" "tcp" 60

echo ""
echo "✅ Configuração concluída!"
echo "📱 Acesse o Uptime Kuma para ver os monitores: $UPTIME_KUMA_URL"

