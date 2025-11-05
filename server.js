const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'sua-chave-secreta-super-segura-aqui',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true em produção com HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

app.use(cors({
    origin: true,
    credentials: true
}));
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

// Middleware de autenticação
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ error: 'Não autenticado' });
};

// Funções de validação
const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validarCPF = (cpf) => {
    if (!cpf) return true; // CPF é opcional
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(10))) return false;
    
    return true;
};

const validarTelefone = (telefone) => {
    if (!telefone) return true; // Telefone é opcional
    const telefoneLimpo = telefone.replace(/\D/g, '');
    return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
};

const validarCEP = (cep) => {
    if (!cep) return true; // CEP é opcional
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.length === 8;
};

// ==================== ROTAS DE AUTENTICAÇÃO ====================

// Login
app.post('/api/login', async (req, res) => {
    const { nome, senha } = req.body;
    
    if (!nome || !senha) {
        return res.status(400).json({ error: 'Nome e senha são obrigatórios' });
    }
    
    try {
        const [rows] = await pool.query(
            'SELECT id, nome, senha FROM usuarios WHERE nome = ?',
            [nome]
        );
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        
        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        
        req.session.userId = usuario.id;
        req.session.userName = usuario.nome;
        
        res.json({ 
            success: true, 
            message: 'Login realizado com sucesso',
            user: { id: usuario.id, nome: usuario.nome }
        });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao fazer logout' });
        }
        res.json({ success: true, message: 'Logout realizado com sucesso' });
    });
});

// Verificar autenticação
app.get('/api/auth/check', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ 
            authenticated: true, 
            user: { id: req.session.userId, nome: req.session.userName }
        });
    } else {
        res.json({ authenticated: false });
    }
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

// ==================== ROTAS DE PESSOAS (PROTEGIDAS) ====================

// Get all people
app.get('/api/people', requireAuth, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, nome, email, telefone, cpf, data_nascimento, endereco, cidade, estado, cep, genero FROM pessoas ORDER BY id DESC'
        );
        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar pessoas:', err);
        res.status(500).json({ error: err.message, code: err.code });
    }
});

// Create person
app.post('/api/people', requireAuth, async (req, res) => {
    const { nome, email, telefone, cpf, data_nascimento, endereco, cidade, estado, cep, genero } = req.body;
    
    // Validações
    if (!nome || !nome.trim()) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    if (nome.trim().length < 3) {
        return res.status(400).json({ error: 'Nome deve ter pelo menos 3 caracteres' });
    }
    if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Email é obrigatório' });
    }
    if (!validarEmail(email)) {
        return res.status(400).json({ error: 'Email inválido' });
    }
    if (cpf && !validarCPF(cpf)) {
        return res.status(400).json({ error: 'CPF inválido' });
    }
    if (telefone && !validarTelefone(telefone)) {
        return res.status(400).json({ error: 'Telefone inválido' });
    }
    if (cep && !validarCEP(cep)) {
        return res.status(400).json({ error: 'CEP inválido' });
    }
    if (estado && estado.length !== 2) {
        return res.status(400).json({ error: 'Estado deve ter 2 caracteres (UF)' });
    }
    
    // Verificar se email já existe
    try {
        const [existing] = await pool.query(
            'SELECT id FROM pessoas WHERE email = ?',
            [email.trim().toLowerCase()]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }
    } catch (err) {
        console.error('Erro ao verificar email:', err);
    }
    
    try {
        const [result] = await pool.query(
            `INSERT INTO pessoas (nome, email, telefone, cpf, data_nascimento, endereco, cidade, estado, cep, genero)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nome.trim(),
                email.trim().toLowerCase(),
                telefone ? telefone.replace(/\D/g, '') : null,
                cpf ? cpf.replace(/\D/g, '') : null,
                data_nascimento || null,
                endereco ? endereco.trim() : null,
                cidade ? cidade.trim() : null,
                estado ? estado.toUpperCase().trim() : null,
                cep ? cep.replace(/\D/g, '') : null,
                genero || null,
            ]
        );
        res.status(201).json({
            id: result.insertId,
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            telefone: telefone ? telefone.replace(/\D/g, '') : null,
            cpf: cpf ? cpf.replace(/\D/g, '') : null,
            data_nascimento: data_nascimento || null,
            endereco: endereco ? endereco.trim() : null,
            cidade: cidade ? cidade.trim() : null,
            estado: estado ? estado.toUpperCase().trim() : null,
            cep: cep ? cep.replace(/\D/g, '') : null,
            genero: genero || null,
        });
    } catch (err) {
        console.error('Erro ao criar pessoa:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }
        res.status(500).json({ error: 'Erro ao salvar pessoa' });
    }
});

// Update person
app.put('/api/people/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, cpf, data_nascimento, endereco, cidade, estado, cep, genero } = req.body;
    
    // Validações (mesmas do POST)
    if (!nome || !nome.trim()) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    if (nome.trim().length < 3) {
        return res.status(400).json({ error: 'Nome deve ter pelo menos 3 caracteres' });
    }
    if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Email é obrigatório' });
    }
    if (!validarEmail(email)) {
        return res.status(400).json({ error: 'Email inválido' });
    }
    if (cpf && !validarCPF(cpf)) {
        return res.status(400).json({ error: 'CPF inválido' });
    }
    if (telefone && !validarTelefone(telefone)) {
        return res.status(400).json({ error: 'Telefone inválido' });
    }
    if (cep && !validarCEP(cep)) {
        return res.status(400).json({ error: 'CEP inválido' });
    }
    if (estado && estado.length !== 2) {
        return res.status(400).json({ error: 'Estado deve ter 2 caracteres (UF)' });
    }
    
    // Verificar se email já existe (excluindo o registro atual)
    try {
        const [existing] = await pool.query(
            'SELECT id FROM pessoas WHERE email = ? AND id != ?',
            [email.trim().toLowerCase(), id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email já cadastrado para outro registro' });
        }
    } catch (err) {
        console.error('Erro ao verificar email:', err);
    }
    
    try {
        const [result] = await pool.query(
            `UPDATE pessoas SET nome = ?, email = ?, telefone = ?, cpf = ?, data_nascimento = ?, endereco = ?, cidade = ?, estado = ?, cep = ?, genero = ? WHERE id = ?`,
            [
                nome.trim(),
                email.trim().toLowerCase(),
                telefone ? telefone.replace(/\D/g, '') : null,
                cpf ? cpf.replace(/\D/g, '') : null,
                data_nascimento || null,
                endereco ? endereco.trim() : null,
                cidade ? cidade.trim() : null,
                estado ? estado.toUpperCase().trim() : null,
                cep ? cep.replace(/\D/g, '') : null,
                genero || null,
                id,
            ]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro não encontrado' });
        res.json({
            id: Number(id),
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            telefone: telefone ? telefone.replace(/\D/g, '') : null,
            cpf: cpf ? cpf.replace(/\D/g, '') : null,
            data_nascimento: data_nascimento || null,
            endereco: endereco ? endereco.trim() : null,
            cidade: cidade ? cidade.trim() : null,
            estado: estado ? estado.toUpperCase().trim() : null,
            cep: cep ? cep.replace(/\D/g, '') : null,
            genero: genero || null,
        });
    } catch (err) {
        console.error('Erro ao atualizar pessoa:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }
        res.status(500).json({ error: 'Erro ao atualizar pessoa' });
    }
});

// Delete person
app.delete('/api/people/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM pessoas WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro não encontrado' });
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao excluir pessoa:', err);
        res.status(500).json({ error: 'Erro ao excluir pessoa' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
