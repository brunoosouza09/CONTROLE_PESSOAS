# Configuração do Domínio na King Host

## Informações Importantes

Seu domínio: `cdp.controlepessoas.kinghost.net`  
IP da VPS: `191.252.214.59`

## Passo 1: Configurar DNS na King Host

### Opção A: Se você tem acesso ao painel de DNS da King Host

1. Acesse o painel da King Host
2. Vá em **DNS** ou **Domínios**
3. Encontre o domínio `controlepessoas.kinghost.net`
4. Configure os registros DNS:

#### Para subdomínio `cdp`:
- **Tipo**: `A`
- **Nome/Host**: `cdp`
- **Valor/IP**: `191.252.214.59`
- **TTL**: `3600` (ou padrão)

### Opção B: Se você precisa criar um subdomínio

1. No painel da King Host, vá em **Subdomínios**
2. Crie um novo subdomínio:
   - **Nome**: `cdp`
   - **Apontar para**: `191.252.214.59`
   - **Tipo**: `A`

## Passo 2: Verificar se o DNS está propagado

Após configurar, aguarde alguns minutos (pode levar até 24 horas, mas geralmente é rápido) e verifique:

```bash
# No terminal da sua máquina local ou VPS
nslookup cdp.controlepessoas.kinghost.net
# ou
dig cdp.controlepessoas.kinghost.net
```

Deve retornar o IP: `191.252.214.59`

## Passo 3: Verificar configuração do Nginx na VPS

O arquivo `nginx.conf` já está configurado com o domínio correto:

```nginx
server_name cdp.controlepessoas.kinghost.net;
```

### Verificar se está funcionando:

```bash
# Na VPS
docker exec controle_pessoas_nginx nginx -t
```

Se aparecer "syntax is ok", está tudo certo!

## Passo 4: Reiniciar o Nginx (se necessário)

```bash
# Na VPS
docker compose restart nginx
```

## Passo 5: Testar acesso pelo domínio

Após a propagação do DNS, teste:

1. Acesse: `http://cdp.controlepessoas.kinghost.net`
2. Deve carregar a mesma aplicação que está em `http://191.252.214.59`

## Troubleshooting

### Domínio não resolve

1. Verifique se o DNS está configurado corretamente na King Host
2. Aguarde a propagação (pode levar algumas horas)
3. Use ferramentas online para verificar:
   - https://dnschecker.org
   - https://www.whatsmydns.net

### Domínio resolve mas não carrega

1. Verifique se a porta 80 está aberta no firewall da VPS:
   ```bash
   sudo ufw status
   sudo ufw allow 80/tcp
   ```

2. Verifique logs do Nginx:
   ```bash
   docker compose logs nginx
   ```

3. Teste se o app está respondendo:
   ```bash
   curl http://localhost:3000/api/health
   ```

### Erro 502 Bad Gateway

Isso significa que o Nginx não consegue se conectar ao app:

1. Verifique se o app está rodando:
   ```bash
   docker compose ps
   ```

2. Verifique se o nome do serviço no nginx.conf está correto:
   ```bash
   grep proxy_pass nginx.conf
   # Deve mostrar: proxy_pass http://controle_pessoas_app:3000;
   ```

3. Teste a conectividade interna:
   ```bash
   docker exec controle_pessoas_nginx ping controle_pessoas_app
   ```

## Configuração Adicional: HTTPS (SSL)

Para adicionar HTTPS (recomendado para produção):

### Opção 1: Usar Let's Encrypt (Gratuito)

1. Instalar Certbot no container Nginx ou na VPS
2. Gerar certificado SSL
3. Configurar Nginx para usar HTTPS

### Opção 2: Usar SSL da King Host

Se a King Host oferece certificado SSL, você pode:
1. Gerar o certificado no painel da King Host
2. Baixar os arquivos `.crt` e `.key`
3. Adicionar ao `nginx.conf`

## Contato com Suporte King Host

Se precisar de ajuda específica da King Host:
- **Suporte**: Através do painel da King Host
- **Documentação**: https://king.host/wiki

## Verificação Final

Após configurar, execute este checklist:

- [ ] DNS configurado na King Host
- [ ] DNS propagado (verificado com nslookup/dig)
- [ ] Nginx rodando na VPS
- [ ] App rodando na VPS
- [ ] Acesso pelo IP funciona: `http://191.252.214.59`
- [ ] Acesso pelo domínio funciona: `http://cdp.controlepessoas.kinghost.net`
- [ ] Logs do Nginx sem erros

