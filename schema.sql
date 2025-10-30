-- Cria o banco de dados e a tabela de pessoas
CREATE DATABASE IF NOT EXISTS cadastro_pessoas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cadastro_pessoas;

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

-- Índice simples por email
CREATE INDEX IF NOT EXISTS idx_pessoas_email ON pessoas(email);




