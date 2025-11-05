#!/bin/bash

# Script para configurar monitores do Uptime Kuma via API
# Execute este script na VPS após fazer login no Uptime Kuma

echo "🔔 Configurando monitores do Uptime Kuma..."
echo ""

# Variáveis (ajuste conforme necessário)
UPTIME_KUMA_URL="http://localhost:3002"
USERNAME=""
PASSWORD=""

# Solicitar credenciais
read -p "Digite o username do Uptime Kuma: " USERNAME
read -sp "Digite a senha do Uptime Kuma: " PASSWORD
echo ""

if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ]; then
    echo "❌ Username e senha são obrigatórios!"
    exit 1
fi

# Função para fazer login e obter token
login() {
    echo "🔐 Fazendo login como $USERNAME..."
    
    # Tentar fazer login
    RESPONSE=$(curl -s -X POST "$UPTIME_KMA_URL/api/login" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" 2>&1)
    
    # Verificar se obteve token
    TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -z "$TOKEN" ]; then
        echo "❌ Erro ao fazer login."
        echo "💡 Verifique:"
        echo "   1. Username e senha estão corretos?"
        echo "   2. Uptime Kuma está rodando em $UPTIME_KUMA_URL?"
        echo "   3. Você já criou a conta admin no Uptime Kuma?"
        echo ""
        echo "Resposta do servidor: $RESPONSE"
        exit 1
    fi
    
    echo "✅ Login realizado com sucesso"
    echo ""
}

# Função para criar monitor
create_monitor() {
    local name=$1
    local url=$2
    local type=$3
    local interval=${4:-60}
    
    echo "➕ Criando monitor: $name ($type)"
    
    # Montar JSON baseado no tipo
    if [ "$type" = "tcp" ]; then
        # Para TCP, usar hostname e port separados
        HOST=$(echo "$url" | cut -d':' -f1)
        PORT=$(echo "$url" | cut -d':' -f2)
        
        JSON_DATA="{
            \"name\": \"$name\",
            \"type\": \"tcp\",
            \"hostname\": \"$HOST\",
            \"port\": $PORT,
            \"interval\": $interval,
            \"retryInterval\": 60,
            \"maxretries\": 3,
            \"expiryNotification\": true
        }"
    else
        # Para HTTP
        JSON_DATA="{
            \"name\": \"$name\",
            \"url\": \"$url\",
            \"type\": \"http\",
            \"interval\": $interval,
            \"retryInterval\": 60,
            \"maxretries\": 3,
            \"expiryNotification\": true,
            \"ignoreTls\": false
        }"
    fi
    
    response=$(curl -s -X POST "$UPTIME_KUMA_URL/api/monitor" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d "$JSON_DATA" 2>&1)
    
    if echo "$response" | grep -q "monitorID\|id"; then
        echo "   ✅ Monitor '$name' criado com sucesso"
    else
        echo "   ⚠️  Erro ao criar monitor '$name'"
        echo "   Resposta: $response"
    fi
}

# Login
login

# Monitores HTTP
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
