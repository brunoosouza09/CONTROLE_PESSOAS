USE cadastro_pessoas;

ALTER TABLE pessoas ADD COLUMN cpf VARCHAR(14) NULL AFTER telefone;
ALTER TABLE pessoas ADD COLUMN data_nascimento DATE NULL AFTER cpf;
ALTER TABLE pessoas ADD COLUMN endereco VARCHAR(200) NULL AFTER data_nascimento;
ALTER TABLE pessoas ADD COLUMN cidade VARCHAR(100) NULL AFTER endereco;
ALTER TABLE pessoas ADD COLUMN estado CHAR(2) NULL AFTER cidade;
ALTER TABLE pessoas ADD COLUMN cep VARCHAR(10) NULL AFTER estado;
ALTER TABLE pessoas ADD COLUMN genero ENUM('M','F','O') NULL AFTER cep;

-- Índice para busca por CPF
CREATE INDEX idx_pessoas_cpf ON pessoas(cpf);


