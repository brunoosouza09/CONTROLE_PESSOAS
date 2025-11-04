#!/bin/bash

echo "=== Script para Restaurar Arquivos Faltantes na VPS ==="
echo ""

# Verificar se está no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ ERRO: Execute este script no diretório /root/CONTROLE_PESSOAS"
    exit 1
fi

echo "Este script irá:"
echo "1. Fazer pull do código mais recente"
echo "2. Verificar e restaurar arquivos faltantes"
echo "3. Verificar estrutura do projeto"
echo ""
read -p "Continuar? (s/N): " confirm

if [[ ! $confirm =~ ^[Ss]$ ]]; then
    echo "Cancelado."
    exit 0
fi

echo ""
echo "Fazendo pull do repositório..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Erro ao fazer pull. Resolva os conflitos primeiro."
    exit 1
fi

echo ""
echo "Verificando arquivos necessários..."

# Lista de arquivos obrigatórios
required_files=("Dockerfile" "docker-compose.yml" "schema.sql" "nginx.conf" "server.js" "package.json")

missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ $file NÃO encontrado!"
        missing_files+=("$file")
    else
        echo "✅ $file encontrado"
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo ""
    echo "⚠️  Arquivos faltantes detectados:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    echo ""
    echo "Tentando restaurar do Git..."
    
    for file in "${missing_files[@]}"; do
        echo "Restaurando $file..."
        git checkout HEAD -- "$file" 2>/dev/null || git checkout origin/main -- "$file" 2>/dev/null
        if [ -f "$file" ]; then
            echo "✅ $file restaurado"
        else
            echo "❌ Não foi possível restaurar $file automaticamente"
        fi
    done
else
    echo ""
    echo "✅ Todos os arquivos necessários estão presentes!"
fi

echo ""
echo "Verificando pasta public..."
if [ -d "public" ]; then
    echo "✅ Pasta public encontrada"
    public_files=("public/app.js" "public/index.html" "public/style.css")
    for file in "${public_files[@]}"; do
        if [ -f "$file" ]; then
            echo "  ✅ $file"
        else
            echo "  ⚠️  $file não encontrado"
        fi
    done
else
    echo "❌ Pasta public NÃO encontrada!"
    echo "Restaurando pasta public do Git..."
    git checkout HEAD -- public/ 2>/dev/null || git checkout origin/main -- public/ 2>/dev/null
fi

echo ""
echo "=== Resumo ==="
echo "Arquivos principais:"
ls -lh Dockerfile docker-compose.yml schema.sql nginx.conf server.js package.json 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'

echo ""
echo "✅ Verificação concluída!"
echo ""
echo "Próximos passos:"
echo "1. Verifique se todos os arquivos estão presentes"
echo "2. Execute: docker compose up -d --build"

