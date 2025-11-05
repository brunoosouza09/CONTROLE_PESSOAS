# 🔔 Guia Completo - Configurar Monitores no Uptime Kuma

## 📋 O que colocar em cada campo

### Para Monitores HTTP (Aplicação, Grafana, Prometheus, Uptime Kuma)

#### Campos obrigatórios:

1. **Name** (Nome):
   - `Aplicação Web`
   - `Grafana`
   - `Prometheus`
   - `Uptime Kuma`

2. **URL** (Endereço):
   - Aplicação: `http://localhost`
   - Grafana: `http://localhost:3001`
   - Prometheus: `http://localhost:9090`
   - Uptime Kuma: `http://localhost:3002`

3. **Type** (Tipo):
   - Selecione: `HTTP(s)`

#### Campos opcionais (podem deixar padrão):

4. **Interval** (Intervalo):
   - `60` segundos (padrão)

5. **Max retries** (Máximo de tentativas):
   - `3` (padrão)

6. **Retry interval** (Intervalo entre tentativas):
   - `60` segundos (padrão)

---

### Para Monitores TCP (MySQL, Nginx)

#### Campos obrigatórios:

1. **Name** (Nome):
   - `MySQL`
   - `Nginx`

2. **Type** (Tipo):
   - Selecione: `TCP Port`

3. **Hostname** (Servidor):
   - MySQL: `controle_pessoas_mysql`
   - Nginx: `localhost`

4. **Port** (Porta):
   - MySQL: `3306`
   - Nginx: `80`

#### Campos opcionais:

5. **Interval** (Intervalo):
   - `60` segundos (padrão)

---

## 📝 Exemplo Completo: Aplicação Web

```
Name: Aplicação Web
URL: http://localhost
Type: HTTP(s)
Interval: 60
Max retries: 3
Retry interval: 60
```

## 📝 Exemplo Completo: MySQL

```
Name: MySQL
Type: TCP Port
Hostname: controle_pessoas_mysql
Port: 3306
Interval: 60
```

---

## ✅ Checklist de Monitores

Configure estes 6 monitores:

- [ ] **Aplicação Web** - HTTP - `http://localhost`
- [ ] **Grafana** - HTTP - `http://localhost:3001`
- [ ] **Prometheus** - HTTP - `http://localhost:9090`
- [ ] **Uptime Kuma** - HTTP - `http://localhost:3002`
- [ ] **MySQL** - TCP - `controle_pessoas_mysql:3306`
- [ ] **Nginx** - TCP - `localhost:80`

---

## 🎯 Dica: Monitorar com Keyword

Para verificar se a página realmente está funcionando (não só respondendo):

1. Ao criar monitor HTTP, selecione **"HTTP(s) - Keyword"**
2. Adicione uma **Keyword**: `Cadastro` (ou qualquer texto da sua página)
3. Isso verifica se a página contém o texto esperado

---

## 🔔 Próximo Passo: Notificações

Depois de configurar os monitores, configure notificações:

1. Vá em **Settings** → **Notifications**
2. Adicione Telegram, Email ou Discord
3. Associe aos monitores

---

## ✅ Pronto!

Após configurar, você verá todos os monitores no dashboard com:
- ✅ Verde = Online
- ❌ Vermelho = Offline
- ⏳ Cinza = Verificando

