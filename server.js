const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MySQL pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cadastro_pessoas',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Health check
app.get('/api/health', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        await conn.ping();
        conn.release();
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Get all people
app.get('/api/people', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, nome, email, telefone, cpf, data_nascimento, endereco, cidade, estado, cep, genero FROM pessoas ORDER BY id DESC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create person
app.post('/api/people', async (req, res) => {
    const { nome, email, telefone, cpf, data_nascimento, endereco, cidade, estado, cep, genero } = req.body;
    if (!nome || !email) {
        return res.status(400).json({ error: 'nome e email são obrigatórios' });
    }
    try {
        const [result] = await pool.query(
            `INSERT INTO pessoas (nome, email, telefone, cpf, data_nascimento, endereco, cidade, estado, cep, genero)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nome,
                email,
                telefone || null,
                cpf || null,
                data_nascimento || null,
                endereco || null,
                cidade || null,
                estado || null,
                cep || null,
                genero || null,
            ]
        );
        res.status(201).json({
            id: result.insertId,
            nome,
            email,
            telefone: telefone || null,
            cpf: cpf || null,
            data_nascimento: data_nascimento || null,
            endereco: endereco || null,
            cidade: cidade || null,
            estado: estado || null,
            cep: cep || null,
            genero: genero || null,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update person
app.put('/api/people/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, cpf, data_nascimento, endereco, cidade, estado, cep, genero } = req.body;
    if (!nome || !email) {
        return res.status(400).json({ error: 'nome e email são obrigatórios' });
    }
    try {
        const [result] = await pool.query(
            `UPDATE pessoas SET nome = ?, email = ?, telefone = ?, cpf = ?, data_nascimento = ?, endereco = ?, cidade = ?, estado = ?, cep = ?, genero = ? WHERE id = ?`,
            [
                nome,
                email,
                telefone || null,
                cpf || null,
                data_nascimento || null,
                endereco || null,
                cidade || null,
                estado || null,
                cep || null,
                genero || null,
                id,
            ]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro não encontrado' });
        res.json({
            id: Number(id),
            nome,
            email,
            telefone: telefone || null,
            cpf: cpf || null,
            data_nascimento: data_nascimento || null,
            endereco: endereco || null,
            cidade: cidade || null,
            estado: estado || null,
            cep: cep || null,
            genero: genero || null,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete person
app.delete('/api/people/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM pessoas WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro não encontrado' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
