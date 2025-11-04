#!/bin/bash

echo "=== Script de Verificação para Configuração King Host ==="
echo ""

DOMAIN="cdp.controlepessoas.kinghost.net"
IP_VPS="191.252.214.59"

echo "Verificando configuração atual..."
echo ""

# Verificar se o Nginx está rodando
echo "1. Verificando Nginx..."
if docker ps | grep -q controle_pessoas_nginx; then
    echo "   ✅ Container Nginx está rodando"
else
    echo "   ❌ Container Nginx NÃO está rodando"
    echo "   Execute: docker compose up -d nginx"
fi

# Verificar configuração do Nginx
echo ""
echo "2. Verificando configuração do Nginx..."
if docker exec controle_pessoas_nginx nginx -t 2>&1 | grep -q "successful"; then
    echo "   ✅ Configuração do Nginx está correta"
else
    echo "   ❌ Erro na configuração do Nginx"
    docker exec controle_pessoas_nginx nginx -t
fi

# Verificar se o domínio está configurado no nginx.conf
echo ""
echo "3. Verificando domínio no nginx.conf..."
if grep -q "$DOMAIN" nginx.conf; then
    echo "   ✅ Domínio $DOMAIN configurado no nginx.conf"
else
    echo "   ❌ Domínio não encontrado no nginx.conf"
fi

# Verificar resolução DNS
echo ""
echo "4. Verificando resolução DNS..."
DNS_RESULT=$(nslookup $DOMAIN 2>/dev/null | grep -A 1 "Name:" | tail -1 | awk '{print $2}' || echo "")
if [ -n "$DNS_RESULT" ]; then
    echo "   ✅ DNS resolvido: $DNS_RESULT"
    if [ "$DNS_RESULT" = "$IP_VPS" ]; then
        echo "   ✅ DNS aponta para o IP correto da VPS"
    else
        echo "   ⚠️  DNS aponta para: $DNS_RESULT (esperado: $IP_VPS)"
        echo "   Configure o DNS na King Host para apontar para: $IP_VPS"
    fi
else
    echo "   ⚠️  Não foi possível resolver o DNS"
    echo "   Pode estar aguardando propagação ou não configurado"
    echo "   Configure na King Host: Tipo A, Nome: cdp, Valor: $IP_VPS"
fi

# Verificar conectividade
echo ""
echo "5. Verificando conectividade..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health | grep -q "200"; then
    echo "   ✅ App está respondendo na porta 3000"
else
    echo "   ❌ App não está respondendo"
fi

# Verificar porta 80
echo ""
echo "6. Verificando porta 80..."
if netstat -tuln 2>/dev/null | grep -q ":80 " || ss -tuln 2>/dev/null | grep -q ":80 "; then
    echo "   ✅ Porta 80 está aberta"
else
    echo "   ⚠️  Porta 80 não está escutando"
    echo "   Verifique: docker compose ps"
fi

echo ""
echo "=== Resumo ==="
echo "Domínio: $DOMAIN"
echo "IP da VPS: $IP_VPS"
echo ""
echo "Próximos passos na King Host:"
echo "1. Acesse o painel da King Host"
echo "2. Vá em DNS ou Subdomínios"
echo "3. Configure:"
echo "   - Tipo: A"
echo "   - Nome: cdp"
echo "   - Valor/IP: $IP_VPS"
echo "   - TTL: 3600 (ou padrão)"
echo ""
echo "Após configurar, aguarde alguns minutos e teste:"
echo "http://$DOMAIN"

