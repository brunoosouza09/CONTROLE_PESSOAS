#!/bin/bash

# Script para testar a API do Uptime Kuma
# Isso ajuda a identificar o problema de login

UPTIME_KUMA_URL="http://localhost:3002"
USERNAME="admin"
PASSWORD="admin123"

echo "🔍 Testando API do Uptime Kuma..."
echo "URL: $UPTIME_KUMA_URL"
echo ""

# Testar se o Uptime Kuma está acessível
echo "1. Testando conectividade..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$UPTIME_KUMA_URL/api/status")
if [ "$RESPONSE" = "200" ]; then
    echo "✅ Uptime Kuma está acessível"
else
    echo "❌ Uptime Kuma não está respondendo (HTTP $RESPONSE)"
    exit 1
fi

echo ""
echo "2. Testando login..."
echo "Tentando fazer login com username: $USERNAME"

# Tentar diferentes formatos de login
echo ""
echo "Tentativa 1: Formato padrão..."
RESPONSE1=$(curl -s -X POST "$UPTIME_KUMA_URL/api/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

echo "Resposta: $RESPONSE1"
echo ""

# Tentar com diferentes campos
echo "Tentativa 2: Com campo 'login'..."
RESPONSE2=$(curl -s -X POST "$UPTIME_KUMA_URL/api/login" \
    -H "Content-Type: application/json" \
    -d "{\"login\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

echo "Resposta: $RESPONSE2"
echo ""

# Verificar se há token
TOKEN1=$(echo "$RESPONSE1" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
TOKEN2=$(echo "$RESPONSE2" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN1" ]; then
    echo "✅ Login funcionou! Token encontrado (formato 1)"
    echo "Token: ${TOKEN1:0:20}..."
elif [ -n "$TOKEN2" ]; then
    echo "✅ Login funcionou! Token encontrado (formato 2)"
    echo "Token: ${TOKEN2:0:20}..."
else
    echo "❌ Nenhum token encontrado nas respostas"
    echo ""
    echo "💡 Verifique:"
    echo "   1. Username e senha estão corretos?"
    echo "   2. Você já criou a conta admin no Uptime Kuma?"
    echo "   3. A API pode precisar de headers diferentes"
fi

