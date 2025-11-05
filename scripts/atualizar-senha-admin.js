const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function atualizarSenha() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'controle_pessoas_mysql',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'cadastro_pessoas',
    });

    try {
        console.log('Gerando hash da senha...');
        const senhaHash = await bcrypt.hash('admin123', 10);
        
        console.log('Atualizando senha do usuário admin...');
        await pool.query('UPDATE usuarios SET senha = ? WHERE nome = ?', [senhaHash, 'admin']);
        
        console.log('✅ Senha do admin atualizada com sucesso!');
        console.log('📝 Usuário: admin');
        console.log('📝 Senha: admin123');
        
        await pool.end();
    } catch (err) {
        console.error('❌ Erro:', err.message);
        process.exit(1);
    }
}

atualizarSenha();

