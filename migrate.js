const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    const connection = await mysql.createConnection({
		host: process.env.DB_HOST || 'localhost',
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || '',
		multipleStatements: true,
	});

	try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (!fs.existsSync(schemaPath)) {
            console.error('schema.sql não encontrado');
            process.exit(1);
        }
        console.log('Executando schema.sql ...');
        await connection.query(fs.readFileSync(schemaPath, 'utf8'));

        const migrationsDir = path.join(__dirname, 'migrations');
        if (fs.existsSync(migrationsDir)) {
            const files = fs.readdirSync(migrationsDir)
                .filter(f => f.endsWith('.sql'))
                .sort();
            for (const file of files) {
                const full = path.join(migrationsDir, file);
                console.log('Executando migration:', file);
                const content = fs.readFileSync(full, 'utf8');
                const statements = content
                    .split(/;\s*(?:\r?\n|$)/)
                    .map(s => s.trim())
                    .filter(Boolean);
                for (const stmt of statements) {
                    try {
                        await connection.query(stmt);
                    } catch (err) {
                        const ignorable = [
                            'ER_DUP_FIELDNAME', // coluna já existe
                            'ER_TABLE_EXISTS_ERROR', // tabela já existe
                            'ER_DUP_KEYNAME', // índice já existe
                            'ER_CANT_CREATE_TABLE' // alguns hosts retornam isso com exists
                        ];
                        if (ignorable.includes(err.code)) {
                            console.log('Ignorando erro esperado:', err.code);
                            continue;
                        }
                        throw err;
                    }
                }
            }
        }
		console.log('Migration concluída com sucesso.');
	} finally {
		await connection.end();
	}
}

run().catch((err) => {
    console.error('Erro na migration:', err && (err.stack || err.code || err.message) || err);
	process.exit(1);
});



