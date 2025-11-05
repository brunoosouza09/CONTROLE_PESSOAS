# 🧪 Guia de Testes Automatizados

## Estrutura de Testes

O projeto utiliza **Jest** para testes automatizados.

### Estrutura de Arquivos

```
CONTROLE_PESSOAS/
├── __tests__/
│   ├── validations.test.js    # Testes de validação
│   └── api.test.js             # Testes de API
├── jest.config.js              # Configuração do Jest
└── package.json                # Scripts de teste
```

## Como Executar os Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch (observa mudanças)
```bash
npm run test:watch
```

### Executar testes com cobertura
```bash
npm run test:coverage
```

## Tipos de Testes

### 1. Testes Unitários (`validations.test.js`)
Testam funções de validação isoladamente:
- ✅ Validação de Email
- ✅ Validação de CPF
- ✅ Validação de Telefone
- ✅ Validação de CEP

### 2. Testes de Integração (`api.test.js`)
Testam endpoints da API:
- ✅ Estrutura de endpoints
- ✅ Validação de requisições
- ✅ Autenticação

## Execução no CI/CD

Os testes são executados automaticamente:

1. **No Pull Request** - Antes de mesclar código
2. **No Push para main** - Antes de fazer deploy
3. **No Deploy** - Antes de publicar na VPS

## Adicionar Novos Testes

### Exemplo: Teste de Validação

```javascript
// __tests__/novo-teste.test.js
describe('Minha Funcionalidade', () => {
  test('deve fazer algo', () => {
    expect(resultado).toBe(esperado);
  });
});
```

### Exemplo: Teste de API

```javascript
// __tests__/endpoint.test.js
const request = require('supertest');
const app = require('../server');

describe('GET /api/endpoint', () => {
  test('deve retornar 200', async () => {
    const res = await request(app)
      .get('/api/endpoint')
      .expect(200);
  });
});
```

## Cobertura de Código

Após executar `npm run test:coverage`, você verá:

- Relatório de cobertura no terminal
- Arquivos HTML em `coverage/` (abrir `index.html` no navegador)

### Meta de Cobertura
- **Mínimo recomendado:** 70%
- **Ideal:** 80%+

## Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "Jest não encontrado"
```bash
npm install --save-dev jest
```

### Testes falhando
1. Verifique se o banco de dados está acessível
2. Verifique variáveis de ambiente
3. Execute `npm test -- --verbose` para mais detalhes

## Próximos Passos

- [ ] Adicionar testes E2E (End-to-End)
- [ ] Adicionar testes de performance
- [ ] Configurar relatórios de cobertura no GitHub
- [ ] Adicionar testes de segurança

