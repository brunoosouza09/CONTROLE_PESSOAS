CONTROLE_PESSOAS

Configuração:
- Instale dependências: npm install
- Crie o banco/tabela: mysql -u root -p < schema.sql
- Crie um arquivo .env com: PORT=3000, DB_HOST=localhost, DB_USER=root, DB_PASSWORD=, DB_NAME=cadastro_pessoas

Executar:
- Desenvolvimento: npm run dev
- Produção: npm start
- Acesse: http://localhost:3000

Docker (local):
- Subir tudo (app + MySQL):
```bash
docker compose up -d --build
```
- Ver logs do app: `docker compose logs -f app`
- Parar/remover: `docker compose down -v`

CI com Docker:
- Cada push para `main` dispara o workflow `.github/workflows/ci.yml` que:
  - Builda a imagem Docker
  - Sobe com `docker compose`
  - Faz smoke test em `/api/health` e `/api/people`





