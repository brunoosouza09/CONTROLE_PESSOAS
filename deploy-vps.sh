#!/bin/bash
# Script para fazer deploy rápido na VPS

echo "🚀 Iniciando deploy na VPS..."

# Conectar na VPS e fazer deploy
ssh root@191.252.214.59 << 'EOF'
set -e
cd /root/CONTROLE_PESSOAS || exit 1
echo "📥 Fazendo pull do código..."
git pull origin main || exit 1
echo "🛑 Parando containers existentes..."
docker compose down || true
echo "🔨 Construindo e iniciando containers..."
docker compose up -d --build
echo "⏳ Aguardando containers iniciarem..."
sleep 15
echo "✅ Verificando status dos containers..."
docker compose ps
echo "📋 Verificando logs do App..."
docker compose logs app --tail=30
echo "✨ Deploy finalizado com sucesso!"
EOF

echo "✅ Deploy concluído!"

