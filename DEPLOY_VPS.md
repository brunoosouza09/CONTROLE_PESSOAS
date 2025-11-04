# Guia de Configuração da VPS

## Pré-requisitos na VPS

### 1. Instalar Docker e Docker Compose
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose (se não estiver incluído)
sudo apt install docker-compose-plugin -y

# Adicionar usuário ao grupo docker (se necessário)
sudo usermod -aG docker $USER
```

### 2. Clonar o Repositório
```bash
cd /root
git clone https://github.com/brunoosouza09/CONTROLE_PESSOAS.git
cd CONTROLE_PESSOAS
```

### 3. Verificar Estrutura de Arquivos
Certifique-se de que na VPS existem:
- ✅ `Dockerfile`
- ✅ `docker-compose.yml`
- ✅ `schema.sql`
- ✅ `nginx.conf`
- ✅ `server.js`
- ✅ `package.json`
- ✅ Pasta `public/` com todos os arquivos

### 4. Configurar SSH para GitHub Actions
```bash
# Gerar chave SSH (se ainda não tiver)
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions

# Adicionar chave pública ao authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Copiar a chave PRIVADA e adicionar como secret no GitHub:
# GitHub Repo > Settings > Secrets and variables > Actions
# Adicionar: SSH_KEY (conteúdo do arquivo ~/.ssh/github_actions)
```

### 5. Configurar Secrets no GitHub
No repositório GitHub, vá em **Settings > Secrets and variables > Actions** e adicione:
- `SSH_KEY`: Chave privada SSH da VPS
- `SSH_USER`: Usuário SSH (ex: `root`)
- `SSH_HOST`: IP ou domínio da VPS

### 6. Testar Deploy Manualmente na VPS
```bash
cd /root/CONTROLE_PESSOAS

# Parar containers existentes
docker compose down

# Remover containers antigos (se necessário)
docker compose rm -f

# Fazer pull do código mais recente
git pull origin main

# Construir e subir containers
docker compose up -d --build

# Verificar logs
docker compose logs -f
```

### 7. Verificar Status dos Containers
```bash
# Ver containers rodando
docker ps

# Verificar logs de cada serviço
docker logs controle_pessoas_app
docker logs controle_pessoas_mysql
docker logs controle_pessoas_nginx

# Verificar saúde do MySQL
docker exec controle_pessoas_mysql mysqladmin ping -h localhost
```

### 8. Verificar Portas
```bash
# Verificar se as portas estão abertas
sudo netstat -tulpn | grep -E ':(80|3000|3306)'

# Ou com ss
sudo ss -tulpn | grep -E ':(80|3000|3306)'
```

### 9. Configurar Firewall (se necessário)
```bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 22/tcp
sudo ufw allow 3000/tcp  # Apenas para testes
sudo ufw enable
```

### 10. Verificar Nginx
```bash
# Testar configuração do nginx
docker exec controle_pessoas_nginx nginx -t

# Ver logs do nginx
docker logs controle_pessoas_nginx
```

## Troubleshooting

### Container não sobe
```bash
# Ver logs detalhados
docker compose logs app
docker compose logs mysql

# Verificar se o Dockerfile está correto
docker build -t teste-app .

# Verificar conectividade entre containers
docker exec controle_pessoas_app ping controle_pessoas_mysql
```

### MySQL não inicia
```bash
# Ver logs do MySQL
docker logs controle_pessoas_mysql

# Verificar se o schema.sql está correto
docker exec -i controle_pessoas_mysql mysql -u root < schema.sql

# Verificar volumes
docker volume ls
docker volume inspect controle_pessoas_mysql_data
```

### App não conecta no MySQL
```bash
# Testar conexão manualmente
docker exec controle_pessoas_app sh -c "node -e \"const mysql = require('mysql2/promise'); (async () => { const conn = await mysql.createConnection({host: 'controle_pessoas_mysql', user: 'root', password: '', database: 'cadastro_pessoas'}); console.log('Conectado!'); await conn.end(); })();\""
```

### Nginx não funciona
```bash
# Verificar se o nome do serviço está correto no nginx.conf
grep proxy_pass nginx.conf

# Verificar se o app está respondendo
curl http://controle_pessoas_app:3000/api/health
```

## Comandos Úteis

```bash
# Reiniciar todos os serviços
docker compose restart

# Parar tudo
docker compose down

# Parar e remover volumes (CUIDADO: apaga dados)
docker compose down -v

# Ver uso de recursos
docker stats

# Limpar recursos não utilizados
docker system prune -a
```

## Verificação Final

Após o deploy, verifique:
1. ✅ Containers estão rodando: `docker ps` (deve mostrar 3 containers)
2. ✅ App responde: `curl http://localhost:3000/api/health`
3. ✅ Nginx funciona: `curl http://localhost` ou acesse pelo domínio
4. ✅ MySQL está saudável: `docker exec controle_pessoas_mysql mysqladmin ping`
5. ✅ Logs sem erros críticos: `docker compose logs | grep -i error`

