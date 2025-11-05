#!/bin/bash

# Script V2 - Versão melhorada para configurar monitores do Uptime Kuma
# Tenta diferentes formatos de API

echo "🔔 Configurando monitores do Uptime Kuma (V2)..."
echo ""

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

# Função para fazer login
login() {
    echo "🔐 Fazendo login como $USERNAME..."
    
    # Tentar diferentes formatos
    TOKEN=""
    
    # Formato 1: username/password
    RESPONSE1=$(curl -s -X POST "$UPTIME_KUMA_URL/api/login" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" 2>&1)
    
    TOKEN=$(echo "$RESPONSE1" | grep -oE '"token":"[^"]*' | cut -d'"' -f4)
    
    # Se não funcionou, tentar formato 2: login/password
    if [ -z "$TOKEN" ]; then
        RESPONSE2=$(curl -s -X POST "$UPTIME_KUMA_URL/api/login" \
            -H "Content-Type: application/json" \
            -d "{\"login\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" 2>&1)
        
        TOKEN=$(echo "$RESPONSE2" | grep -oE '"token":"[^"]*' | cut -d'"' -f4)
    fi
    
    # Se ainda não funcionou, tentar com cookie
    if [ -z "$TOKEN" ]; then
        echo "⚠️  Tentando método alternativo com cookie..."
        COOKIE_JAR="/tmp/uptime_kuma_cookies.txt"
        
        RESPONSE3=$(curl -s -c "$COOKIE_JAR" -X POST "$UPTIME_KUMA_URL/api/login" \
            -H "Content-Type: application/json" \
            -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" 2>&1)
        
        # Verificar se login foi bem-sucedido
        if echo "$RESPONSE3" | grep -q "success\|ok\|token"; then
            echo "✅ Login pode ter funcionado (verificando cookie)..."
            TOKEN="cookie_method"
        fi
    fi
    
    if [ -z "$TOKEN" ] && [ "$TOKEN" != "cookie_method" ]; then
        echo "❌ Erro ao fazer login."
        echo ""
        echo "Respostas recebidas:"
        echo "Formato 1: $RESPONSE1"
        echo "Formato 2: $RESPONSE2"
        echo ""
        echo "💡 Dica: Use a configuração manual (veja CONFIGURACAO_MANUAL_MONITORES.md)"
        exit 1
    fi
    
    echo "✅ Login realizado com sucesso"
    echo ""
}

# Função para criar monitor (versão simplificada)
create_monitor() {
    local name=$1
    local url=$2
    local type=$3
    
    echo "➕ Criando monitor: $name"
    
    if [ "$type" = "tcp" ]; then
        HOST=$(echo "$url" | cut -d':' -f1)
        PORT=$(echo "$url" | cut -d':' -f2)
        
        JSON_DATA="{\"name\":\"$name\",\"type\":\"tcp\",\"hostname\":\"$HOST\",\"port\":$PORT,\"interval\":60}"
    else
        JSON_DATA="{\"name\":\"$name\",\"url\":\"$url\",\"type\":\"http\",\"interval\":60}"
    fi
    
    if [ "$TOKEN" = "cookie_method" ]; then
        response=$(curl -s -b "$COOKIE_JAR" -X POST "$UPTIME_KUMA_URL/api/monitor" \
            -H "Content-Type: application/json" \
            -d "$JSON_DATA" 2>&1)
    else
        response=$(curl -s -X POST "$UPTIME_KUMA_URL/api/monitor" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -d "$JSON_DATA" 2>&1)
    fi
    
    if echo "$response" | grep -qE "monitorID|id|success"; then
        echo "   ✅ Monitor '$name' criado"
    else
        echo "   ⚠️  Possível erro: $response"
    fi
}

# Executar
login

echo "📊 Criando monitores..."
create_monitor "Aplicação Web" "http://localhost" "http"
create_monitor "Grafana" "http://localhost:3001" "http"
create_monitor "Prometheus" "http://localhost:9090" "http"
create_monitor "Uptime Kuma" "http://localhost:3002" "http"
create_monitor "MySQL" "controle_pessoas_mysql:3306" "tcp"
create_monitor "Nginx" "localhost:80" "tcp"

echo ""
echo "✅ Processo concluído!"
echo "📱 Verifique no Uptime Kuma: $UPTIME_KUMA_URL"

