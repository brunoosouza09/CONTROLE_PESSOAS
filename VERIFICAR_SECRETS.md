# 🔍 Verificar Secrets no GitHub

## Como Verificar se os Secrets Estão Configurados

### 1. Acessar Secrets
1. Vá para: https://github.com/brunoosouza09/CONTROLE_PESSOAS/settings/secrets/actions
2. Você deve ver uma lista de secrets

### 2. Verificar Secrets Necessários

Você precisa ter **exatamente** estes 3 secrets (case-sensitive):

#### ✅ Secret 1: `SSH_KEY`
- **Nome**: `SSH_KEY` (maiúsculas, exatamente assim)
- **Valor**: Chave privada SSH completa (desde `-----BEGIN` até `-----END`)
- **Status**: Deve aparecer na lista com um ícone de olho para ver/editar

#### ✅ Secret 2: `SSH_HOST`
- **Nome**: `SSH_HOST` (maiúsculas, exatamente assim)
- **Valor**: `191.252.214.59` (IP da VPS)
- **Status**: Deve aparecer na lista

#### ✅ Secret 3: `SSH_USER`
- **Nome**: `SSH_USER` (maiúsculas, exatamente assim)
- **Valor**: `root` (opcional, se não existir, usa "root" como padrão)
- **Status**: Opcional, mas recomendado

### 3. Se Algum Secret Não Existir

1. Clique em **"New repository secret"**
2. Digite o **nome exatamente** como mostrado acima (maiúsculas)
3. Cole o **valor**
4. Clique em **"Add secret"**

### 4. Se o Secret Estiver com Nome Errado

**Nomes errados comuns:**
- ❌ `ssh_key` (minúsculas)
- ❌ `SSH_Key` (misturado)
- ❌ `CLOUD_SSH_KEY` (nome diferente)
- ❌ `ssh-host` (com hífen)
- ❌ `SSH HOST` (com espaço)

**Nome correto:**
- ✅ `SSH_KEY`
- ✅ `SSH_HOST`
- ✅ `SSH_USER`

### 5. Verificar se o Secret Está Vazio

Se o secret existe mas está vazio:
1. Clique no secret
2. Verifique se há conteúdo no campo "Value"
3. Se estiver vazio, edite e adicione o valor correto

### 6. Testar Após Configurar

Após configurar todos os secrets:
1. Aguarde o workflow rodar automaticamente (ou execute manualmente)
2. Verifique os logs em: https://github.com/brunoosouza09/CONTROLE_PESSOAS/actions
3. Deve mostrar: "✅ Todos os secrets necessários estão configurados!"

## Checklist Final

- [ ] Secret `SSH_KEY` existe com nome exato `SSH_KEY`
- [ ] Secret `SSH_HOST` existe com nome exato `SSH_HOST` e valor `191.252.214.59`
- [ ] Secret `SSH_USER` existe (opcional) ou será usado "root" como padrão
- [ ] Nenhum espaço extra antes ou depois dos valores
- [ ] Nomes dos secrets estão em maiúsculas exatamente como mostrado

