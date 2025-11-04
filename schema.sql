-- Cria a tabela de pessoas
-- Nota: O banco de dados já é criado automaticamente pela variável MYSQL_DATABASE no docker-compose
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
CREATE INDEX idx_pessoas_email ON pessoas(email);




