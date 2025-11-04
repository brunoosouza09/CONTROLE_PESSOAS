#!/bin/bash

echo "=== Verificação da VPS - Controle de Pessoas ==="
echo ""

# Verificar se está no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ ERRO: docker-compose.yml não encontrado!"
    echo "Execute este script no diretório /root/CONTROLE_PESSOAS"
    exit 1
fi

echo "✅ Diretório correto"
echo ""

# Verificar arquivos necessários
echo "Verificando arquivos necessários..."
files=("Dockerfile" "docker-compose.yml" "schema.sql" "nginx.conf" "server.js" "package.json")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file encontrado"
    else
        echo "❌ $file NÃO encontrado!"
    fi
done

echo ""
echo "Verificando pasta public..."
if [ -d "public" ]; then
    echo "✅ Pasta public encontrada"
    public_files=("public/app.js" "public/index.html" "public/style.css")
    for file in "${public_files[@]}"; do
        if [ -f "$file" ]; then
            echo "  ✅ $file"
        else
            echo "  ❌ $file NÃO encontrado!"
        fi
    done
else
    echo "❌ Pasta public NÃO encontrada!"
fi

echo ""
echo "=== Status dos Containers ==="
docker compose ps

echo ""
echo "=== Logs do MySQL (últimas 10 linhas) ==="
docker compose logs mysql --tail=10 2>/dev/null || echo "Container MySQL não está rodando"

echo ""
echo "=== Logs do App (últimas 10 linhas) ==="
docker compose logs app --tail=10 2>/dev/null || echo "Container App não está rodando"

echo ""
echo "=== Logs do Nginx (últimas 10 linhas) ==="
docker compose logs nginx --tail=10 2>/dev/null || echo "Container Nginx não está rodando"

echo ""
echo "=== Verificação de Saúde do MySQL ==="
if docker exec controle_pessoas_mysql mysqladmin ping -h localhost > /dev/null 2>&1; then
    echo "✅ MySQL está respondendo"
else
    echo "❌ MySQL não está respondendo"
fi

echo ""
echo "=== Verificação de Portas ==="
for port in 80 3000 3306; do
    if netstat -tuln 2>/dev/null | grep -q ":$port " || ss -tuln 2>/dev/null | grep -q ":$port "; then
        echo "✅ Porta $port está aberta"
    else
        echo "⚠️  Porta $port não está aberta ou não está escutando"
    fi
done

echo ""
echo "=== Verificação Final ==="
echo "Para testar o app: curl http://localhost:3000/api/health"
echo "Para testar o nginx: curl http://localhost"

