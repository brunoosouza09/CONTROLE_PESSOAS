# 🧪 Como Funcionam os Testes Automatizados

## 📖 Conceito Básico

Testes automatizados são scripts que verificam se o código está funcionando corretamente, **sem precisar testar manualmente** no navegador.

## 🎯 Tipos de Testes

### 1. Testes Unitários
Testam **funções isoladas** (uma por vez).

**Exemplo:**
```javascript
// Testa se a função validarEmail funciona
test('deve aceitar email válido', () => {
  expect(validarEmail('teste@example.com')).toBe(true);
});
```

**O que faz:**
- Chama a função `validarEmail('teste@example.com')`
- Verifica se o resultado é `true`
- Se for `true`, o teste passa ✅
- Se for `false`, o teste falha ❌

### 2. Testes de Integração
Testam se **várias partes funcionam juntas** (ex: API + Banco de dados).

## 🔍 Como Funciona o Jest

### Estrutura de um Teste

```javascript
describe('Nome do Grupo', () => {
  test('descrição do que está testando', () => {
    // Código do teste
    expect(resultado).toBe(esperado);
  });
});
```

### Palavras-chave

- **`describe`** - Agrupa testes relacionados
- **`test`** ou **`it`** - Define um teste individual
- **`expect`** - Verifica se o resultado é o esperado
- **`toBe`** - Compara valores (===)

### Exemplos Práticos

#### Exemplo 1: Teste de Email
```javascript
test('deve aceitar email válido', () => {
  expect(validarEmail('teste@example.com')).toBe(true);
  // Se validarEmail retornar true, o teste passa ✅
});
```

#### Exemplo 2: Teste de CPF
```javascript
test('deve rejeitar CPF inválido', () => {
  expect(validarCPF('123456789')).toBe(false);
  // Se validarCPF retornar false, o teste passa ✅
});
```

## 🚀 Como Executar

### 1. Executar todos os testes
```bash
npm test
```

**Resultado:**
```
PASS __tests__/validations.test.js
  Validações
    validarEmail
      ✓ deve aceitar email válido
      ✓ deve rejeitar email inválido
    ...
    
Test Suites: 2 passed, 2 total
Tests:       18 passed, 18 total
```

### 2. Executar em modo watch (observa mudanças)
```bash
npm run test:watch
```
- Roda os testes automaticamente quando você salva arquivos
- Útil durante o desenvolvimento

### 3. Ver cobertura de código
```bash
npm run test:coverage
```
- Mostra quantos % do código está sendo testado
- Gera relatório em `coverage/`

## 🔄 Fluxo no CI/CD

### 1. Você faz push para o GitHub
```bash
git push origin main
```

### 2. GitHub Actions executa automaticamente:
```
1. ✅ Checkout do código
2. ✅ Instalar dependências (npm ci)
3. ✅ Executar testes (npm test)
4. ✅ Se testes passarem → Fazer deploy
5. ❌ Se testes falharem → Bloqueia deploy
```

### 3. Resultado
- **Testes passando** → Deploy acontece automaticamente
- **Testes falhando** → Deploy é bloqueado (proteção)

## 📊 O que os Testes Verificam

### ✅ Testes de Validação
- Email válido/inválido
- CPF válido/inválido
- Telefone válido/inválido
- CEP válido/inválido

### ✅ Testes de API
- Estrutura de endpoints
- Validação de requisições
- Autenticação

## 💡 Benefícios

1. **Detecta erros rapidamente** - Antes de chegar em produção
2. **Confiança** - Saber que mudanças não quebraram nada
3. **Documentação viva** - Testes mostram como usar o código
4. **Deploy seguro** - Só faz deploy se tudo estiver funcionando

## 🎓 Exemplo Prático

### Cenário: Você altera a função de validar email

**Sem testes:**
- Você precisa testar manualmente no navegador
- Pode esquecer de testar algum caso
- Erro só aparece quando alguém usar

**Com testes:**
```bash
npm test
# Testes executam automaticamente
# Se algo quebrar, você sabe na hora
```

## 📝 Criar Novo Teste

### Passo 1: Criar arquivo de teste
```bash
__tests__/minha-funcao.test.js
```

### Passo 2: Escrever o teste
```javascript
describe('Minha Função', () => {
  test('deve fazer algo corretamente', () => {
    const resultado = minhaFuncao('entrada');
    expect(resultado).toBe('esperado');
  });
});
```

### Passo 3: Executar
```bash
npm test
```

## 🔍 Resultado dos Testes

### ✅ Teste Passando
```
✓ deve aceitar email válido (4 ms)
```

### ❌ Teste Falhando
```
✕ deve aceitar email válido
  Expected: true
  Received: false
```

## 🎯 Resumo

1. **Testes são scripts** que verificam se o código funciona
2. **Jest** é a ferramenta que executa os testes
3. **`npm test`** executa todos os testes
4. **GitHub Actions** executa testes automaticamente no CI/CD
5. **18 testes** estão configurados e passando ✅

## 📚 Próximos Passos

Para entender melhor:
1. Abra `__tests__/validations.test.js` e veja os exemplos
2. Execute `npm test` para ver os testes rodando
3. Modifique um teste e veja o que acontece
4. Adicione novos testes para suas funções

