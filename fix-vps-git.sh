#!/bin/bash

echo "=== Script para Resolver Conflitos Git na VPS ==="
echo ""

# Verificar se está no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ ERRO: Execute este script no diretório /root/CONTROLE_PESSOAS"
    exit 1
fi

echo "Este script irá:"
echo "1. Fazer backup dos arquivos locais modificados"
echo "2. Remover arquivos não rastreados que conflitam"
echo "3. Fazer pull do código mais recente"
echo ""
read -p "Continuar? (s/N): " confirm

if [[ ! $confirm =~ ^[Ss]$ ]]; then
    echo "Cancelado."
    exit 0
fi

# Criar diretório de backup
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo ""
echo "Criando backup em: $BACKUP_DIR"

# Fazer backup dos arquivos modificados
echo "Fazendo backup dos arquivos locais..."
if [ -f "docker-compose.yml" ]; then
    cp docker-compose.yml "$BACKUP_DIR/" 2>/dev/null || true
fi
if [ -f "nginx.conf" ]; then
    cp nginx.conf "$BACKUP_DIR/" 2>/dev/null || true
fi
if [ -f ".dockerignore" ]; then
    cp .dockerignore "$BACKUP_DIR/" 2>/dev/null || true
fi
if [ -f "Dockerfile" ]; then
    cp Dockerfile "$BACKUP_DIR/" 2>/dev/null || true
fi

echo "✅ Backup criado"
echo ""

# Fazer stash das mudanças locais
echo "Fazendo stash das mudanças locais..."
git stash push -m "Backup antes do pull $(date +%Y%m%d_%H%M%S)" || true

# Remover arquivos não rastreados que conflitam
echo "Removendo arquivos não rastreados que conflitam..."
rm -f .dockerignore Dockerfile 2>/dev/null || true

# Restaurar docker-compose.yml e nginx.conf do stash (se necessário)
echo "Restaurando arquivos do repositório..."
git checkout -- docker-compose.yml nginx.conf 2>/dev/null || true

# Fazer pull
echo ""
echo "Fazendo pull do repositório remoto..."
git pull origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Pull realizado com sucesso!"
    echo ""
    echo "Arquivos de backup salvos em: $BACKUP_DIR"
    echo ""
    echo "Próximos passos:"
    echo "1. Verificar se os arquivos estão corretos"
    echo "2. Se precisar de algo do backup, está em: $BACKUP_DIR"
    echo "3. Executar: docker compose up -d --build"
else
    echo ""
    echo "❌ Erro ao fazer pull. Verifique os erros acima."
    echo "Arquivos de backup estão em: $BACKUP_DIR"
fi

