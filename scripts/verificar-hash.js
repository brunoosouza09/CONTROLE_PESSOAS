const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function verificarHash() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'controle_pessoas_mysql',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'cadastro_pessoas',
    });

    try {
        // Buscar usuário admin
        const [rows] = await pool.query('SELECT id, nome, senha FROM usuarios WHERE nome = ?', ['admin']);
        
        if (rows.length === 0) {
            console.log('❌ Usuário admin não encontrado');
            await pool.end();
            return;
        }

        const usuario = rows[0];
        console.log('Usuário encontrado:', usuario.nome);
        console.log('Hash atual:', usuario.senha);
        
        // Testar senha
        const senhaTeste = 'admin123';
        console.log('\nTestando senha:', senhaTeste);
        
        const hashValido = await bcrypt.compare(senhaTeste, usuario.senha);
        
        if (hashValido) {
            console.log('✅ Hash válido! A senha está correta.');
        } else {
            console.log('❌ Hash inválido! A senha não corresponde.');
            console.log('\nGerando novo hash para admin123...');
            const novoHash = await bcrypt.hash(senhaTeste, 10);
            console.log('Novo hash:', novoHash);
            console.log('\nExecute este comando para atualizar:');
            console.log(`docker exec controle_pessoas_mysql mysql -u root -proot cadastro_pessoas -e "UPDATE usuarios SET senha = '${novoHash}' WHERE nome = 'admin';"`);
        }

        await pool.end();
    } catch (err) {
        console.error('❌ Erro:', err.message);
        process.exit(1);
    }
}

verificarHash();

