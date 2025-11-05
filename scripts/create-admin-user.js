const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createAdminUser() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'cadastro_pessoas',
    });

    try {
        // Verificar se a tabela existe
        const [tables] = await pool.query(
            "SHOW TABLES LIKE 'usuarios'"
        );

        if (tables.length === 0) {
            console.log('Criando tabela usuarios...');
            await pool.query(`
                CREATE TABLE usuarios (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nome VARCHAR(100) NOT NULL UNIQUE,
                    senha VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ Tabela usuarios criada');
        }

        // Verificar se usuário admin já existe
        const [existing] = await pool.query(
            'SELECT id FROM usuarios WHERE nome = ?',
            ['admin']
        );

        if (existing.length > 0) {
            console.log('⚠️  Usuário admin já existe');
            console.log('Para alterar a senha, exclua o usuário e execute este script novamente');
            await pool.end();
            return;
        }

        // Criar senha hash
        const senhaPadrao = 'admin123';
        const senhaHash = await bcrypt.hash(senhaPadrao, 10);

        // Inserir usuário admin
        await pool.query(
            'INSERT INTO usuarios (nome, senha) VALUES (?, ?)',
            ['admin', senhaHash]
        );

        console.log('✅ Usuário admin criado com sucesso!');
        console.log('📝 Credenciais:');
        console.log('   Usuário: admin');
        console.log('   Senha: admin123');
        console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

        await pool.end();
    } catch (err) {
        console.error('❌ Erro ao criar usuário admin:', err);
        process.exit(1);
    }
}

createAdminUser();

