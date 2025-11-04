#!/bin/bash

echo "=== Verificação e Correção do Banco de Dados ==="
echo ""

# Verificar se a tabela existe
echo "Verificando se a tabela 'pessoas' existe..."
TABLE_EXISTS=$(docker exec controle_pessoas_mysql mysql -u root -proot -e "USE cadastro_pessoas; SHOW TABLES LIKE 'pessoas';" 2>/dev/null | grep -c pessoas || echo "0")

if [ "$TABLE_EXISTS" -eq "0" ]; then
    echo "❌ Tabela 'pessoas' NÃO existe!"
    echo ""
    echo "Criando tabela..."
    
    # Criar tabela diretamente
    docker exec -i controle_pessoas_mysql mysql -u root -proot cadastro_pessoas << EOF
CREATE TABLE IF NOT EXISTS pessoas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    telefone VARCHAR(30) NULL,
    cpf VARCHAR(14) NULL,
    data_nascimento DATE NULL,
    endereco VARCHAR(200) NULL,
    cidade VARCHAR(100) NULL,
    estado CHAR(2) NULL,
    cep VARCHAR(10) NULL,
    genero ENUM('M','F','O') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pessoas_email ON pessoas(email);
EOF

    if [ $? -eq 0 ]; then
        echo "✅ Tabela criada com sucesso!"
    else
        echo "❌ Erro ao criar tabela"
        exit 1
    fi
else
    echo "✅ Tabela 'pessoas' existe"
fi

echo ""
echo "Verificando estrutura da tabela..."
docker exec controle_pessoas_mysql mysql -u root -proot -e "USE cadastro_pessoas; DESCRIBE pessoas;" 2>/dev/null

echo ""
echo "Contando registros..."
docker exec controle_pessoas_mysql mysql -u root -proot -e "USE cadastro_pessoas; SELECT COUNT(*) as total FROM pessoas;" 2>/dev/null

echo ""
echo "✅ Verificação concluída!"

