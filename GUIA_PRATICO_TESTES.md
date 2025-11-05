# 🎯 Guia Prático - Como Fazer Testes

## 📝 Como Criar um Novo Teste

### 1. Criar Arquivo de Teste
Crie um arquivo terminado em `.test.js` dentro da pasta `__tests__/`

Exemplo: `__tests__/minha-funcao.test.js`

### 2. Estrutura Básica
```javascript
describe('Nome do Grupo de Testes', () => {
  test('descrição do teste', () => {
    // Seu teste aqui
    expect(resultado).toBe(esperado);
  });
});
```

### 3. Exemplo Completo
```javascript
describe('Minha Função', () => {
  test('deve retornar o valor correto', () => {
    const resultado = minhaFuncao('entrada');
    expect(resultado).toBe('esperado');
  });

  test('deve lidar com erro', () => {
    expect(() => minhaFuncao(null)).toThrow();
  });
});
```

## 🔧 Como Modificar Testes Existentes

### Adicionar Novo Teste no Arquivo Existente
```javascript
// No arquivo __tests__/validations.test.js
describe('validarEmail', () => {
  // ... testes existentes ...

  test('deve aceitar email com subdomínio', () => {
    expect(validarEmail('teste@sub.dominio.com')).toBe(true);
  });
});
```

### Modificar Teste Existente
```javascript
// Antes
test('deve aceitar email válido', () => {
  expect(validarEmail('teste@example.com')).toBe(true);
});

// Depois (mais completo)
test('deve aceitar email válido', () => {
  expect(validarEmail('teste@example.com')).toBe(true);
  expect(validarEmail('usuario@dominio.com.br')).toBe(true);
  expect(validarEmail('nome.sobrenome@empresa.com')).toBe(true);
});
```

## 🚀 Como Executar Testes Específicos

### Executar apenas um arquivo
```bash
npm test validations.test.js
```

### Executar testes que contenham uma palavra
```bash
npm test -- -t "email"
# Executa apenas testes que contenham "email" no nome
```

### Executar em modo watch (observa mudanças)
```bash
npm run test:watch
```

## 📊 Ver Cobertura de Código

### Gerar relatório de cobertura
```bash
npm run test:coverage
```

### Ver relatório HTML
Após executar, abra: `coverage/lcov-report/index.html` no navegador

## 🎓 Exemplos Práticos

### Exemplo 1: Testar uma Função Simples
```javascript
// Função que você quer testar
function somar(a, b) {
  return a + b;
}

// Teste
describe('somar', () => {
  test('deve somar dois números', () => {
    expect(somar(2, 3)).toBe(5);
    expect(somar(10, 20)).toBe(30);
  });

  test('deve lidar com números negativos', () => {
    expect(somar(-5, 5)).toBe(0);
  });
});
```

### Exemplo 2: Testar Validação
```javascript
describe('validarNome', () => {
  test('deve aceitar nome com 3 ou mais caracteres', () => {
    expect(validarNome('João')).toBe(true);
    expect(validarNome('Ana')).toBe(true);
  });

  test('deve rejeitar nome muito curto', () => {
    expect(validarNome('Jo')).toBe(false);
    expect(validarNome('')).toBe(false);
  });
});
```

### Exemplo 3: Testar API
```javascript
const request = require('supertest');
const app = require('../server');

describe('GET /api/people', () => {
  test('deve retornar 401 sem autenticação', async () => {
    const res = await request(app)
      .get('/api/people')
      .expect(401);
  });
});
```

## 🔍 Assertions (Comparações) Úteis

```javascript
// Igualdade
expect(valor).toBe(esperado);        // ===
expect(valor).toEqual(esperado);     // Compara objetos

// Verdadeiro/Falso
expect(valor).toBeTruthy();
expect(valor).toBeFalsy();

// Números
expect(valor).toBeGreaterThan(5);
expect(valor).toBeLessThan(10);

// Strings
expect(string).toContain('texto');
expect(string).toMatch(/regex/);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain(item);

// Erros
expect(() => funcao()).toThrow();
expect(() => funcao()).toThrow('mensagem de erro');
```

## 🐛 Depurar Testes

### Ver logs durante o teste
```javascript
test('meu teste', () => {
  console.log('Valor:', resultado);
  expect(resultado).toBe(esperado);
});
```

### Executar apenas um teste
```javascript
// Adicione .only antes do test
test.only('apenas este teste', () => {
  // Apenas este teste será executado
});
```

### Pular um teste
```javascript
test.skip('teste que não quer rodar', () => {
  // Este teste será pulado
});
```

## 📋 Checklist para Criar Teste

- [ ] Criar arquivo `.test.js` na pasta `__tests__/`
- [ ] Importar/definir a função a ser testada
- [ ] Criar `describe()` para agrupar testes
- [ ] Criar `test()` para cada caso
- [ ] Usar `expect()` para verificar resultado
- [ ] Executar `npm test` para verificar
- [ ] Teste passa? ✅ Pronto!

## 💡 Dicas

1. **Um teste = uma coisa** - Cada teste deve verificar apenas uma funcionalidade
2. **Nomes descritivos** - O nome do teste deve explicar o que está sendo testado
3. **Teste casos extremos** - Teste valores válidos E inválidos
4. **Mantenha testes simples** - Fácil de entender e manter

## 🎯 Próximos Passos

1. **Experimente** - Modifique um teste existente e veja o resultado
2. **Adicione** - Crie um novo teste para alguma funcionalidade
3. **Execute** - Rode `npm test` para ver os resultados
4. **Aprenda** - Veja os exemplos nos arquivos existentes

