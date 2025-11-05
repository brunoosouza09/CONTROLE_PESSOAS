# Solução Completa - Problemas no Deploy

## 🔍 Problemas Identificados

1. **Script "create-admin" não encontrado** - O container não tem o código atualizado
2. **Migrate.js precisa de correção** - Já corrigido no código

## ✅ Solução Passo a Passo

### Opção 1: Atualizar Manualmente (Recomendado)

Execute estes comandos na VPS:

```bash
# 1. Ir para o diretório
cd /root/CONTROLE_PESSOAS

# 2. Fazer pull do código mais recente
git pull origin main

# 3. Parar os containers
docker compose down

# 4. Reconstruir e subir os containers (isso vai atualizar o código)
docker compose up -d --build

# 5. Aguardar containers iniciarem (10-15 segundos)
sleep 15

# 6. Verificar se o container está rodando
docker compose ps

# 7. Executar migrações
docker exec controle_pessoas_app npm run migrate

# 8. Criar usuário admin (agora deve funcionar)
docker exec controle_pessoas_app npm run create-admin
```

### Opção 2: Criar Usuário Admin Manualmente (Alternativa)

Se o script ainda não funcionar, crie o usuário diretamente no banco:

```bash
# Conectar no MySQL e criar usuário
docker exec -it controle_pessoas_mysql mysql -u root -proot cadastro_pessoas

# Dentro do MySQL, execute:
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Sair do MySQL
exit
```

Depois, use o script Node.js diretamente:

```bash
# Criar arquivo temporário com o script
docker exec controle_pessoas_app sh -c 'cat > /tmp/create-admin.js << "EOF"
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

async function createAdmin() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "controle_pessoas_mysql",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "cadastro_pessoas"
  });

  try {
    const [existing] = await pool.query("SELECT id FROM usuarios WHERE nome = ?", ["admin"]);
    if (existing.length > 0) {
      console.log("⚠️  Usuário admin já existe");
      await pool.end();
      return;
    }

    const senhaHash = await bcrypt.hash("admin123", 10);
    await pool.query("INSERT INTO usuarios (nome, senha) VALUES (?, ?)", ["admin", senhaHash]);
    
    console.log("✅ Usuário admin criado!");
    console.log("📝 Usuário: admin");
    console.log("📝 Senha: admin123");
    await pool.end();
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  }
}

createAdmin();
EOF'

# Executar o script
docker exec controle_pessoas_app node /tmp/create-admin.js
```

### Opção 3: Verificar e Reinstalar Dependências

```bash
# Entrar no container
docker exec -it controle_pessoas_app sh

# Dentro do container:
cd /app
npm install
npm run create-admin

# Sair do container
exit
```

## 🔍 Verificações

### Verificar se o código está atualizado:

```bash
# Verificar se o package.json tem o script
docker exec controle_pessoas_app cat package.json | grep create-admin
```

### Verificar se a tabela de usuários existe:

```bash
docker exec controle_pessoas_mysql mysql -u root -proot -e "USE cadastro_pessoas; SHOW TABLES LIKE 'usuarios';"
```

### Verificar se o usuário foi criado:

```bash
docker exec controle_pessoas_mysql mysql -u root -proot -e "USE cadastro_pessoas; SELECT * FROM usuarios;"
```

## 🎯 Solução Rápida (Tudo de Uma Vez)

Execute este comando completo:

```bash
cd /root/CONTROLE_PESSOAS && \
git pull origin main && \
docker compose down && \
docker compose up -d --build && \
sleep 15 && \
docker exec controle_pessoas_app npm run migrate && \
docker exec controle_pessoas_app npm run create-admin
```

## 📝 Notas

- O script `create-admin` está no `package.json` local
- O container precisa ter o código atualizado para o script estar disponível
- Se o `git pull` não funcionar, pode ser necessário fazer `docker compose down -v` para limpar volumes

## 🔐 Após Criar o Usuário

- **Usuário:** `admin`
- **Senha:** `admin123`
- **Acesso:** `http://cdp.controlepessoas.kinghost.net/login.html`

