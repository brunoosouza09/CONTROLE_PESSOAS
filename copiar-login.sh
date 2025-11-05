#!/bin/bash

echo "Copiando arquivos de login para o container..."

# Copiar login.html
docker cp public/login.html controle_pessoas_app:/app/public/login.html

# Copiar login.js
docker cp public/login.js controle_pessoas_app:/app/public/login.js

echo "✅ Arquivos copiados com sucesso!"
echo "Teste acessando: http://cdp.controlepessoas.kinghost.net/login.html"

