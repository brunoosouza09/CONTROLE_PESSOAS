// EXEMPLO PRÁTICO - Como criar um teste passo a passo

// ============================================
// PASSO 1: Escolher o que você quer testar
// ============================================
// Exemplo: Vamos testar uma função que formata telefone

// ============================================
// PASSO 2: Criar o arquivo de teste
// ============================================
// Arquivo: __tests__/formatacao.test.js

// ============================================
// PASSO 3: Escrever o teste
// ============================================

describe('Formatação de Telefone', () => {
  // Primeiro, você precisa da função que será testada
  // (pode ser copiada do seu código ou importada)
  function formatarTelefone(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  }

  // AGORA ESCREVA OS TESTES:

  // Teste 1: Caso que deve funcionar
  test('deve formatar telefone de 10 dígitos', () => {
    const resultado = formatarTelefone('1899999999');
    expect(resultado).toBe('(18) 9999-9999');
  });

  // Teste 2: Outro caso que deve funcionar
  test('deve formatar celular de 11 dígitos', () => {
    const resultado = formatarTelefone('18999999999');
    expect(resultado).toBe('(18) 99999-9999');
  });

  // Teste 3: Caso extremo (telefone já formatado)
  test('deve formatar telefone já formatado', () => {
    const resultado = formatarTelefone('(18) 9999-9999');
    expect(resultado).toBe('(18) 9999-9999');
  });
});

// ============================================
// PASSO 4: Executar o teste
// ============================================
// No terminal: npm test

// ============================================
// RESULTADO ESPERADO:
// ============================================
// PASS __tests__/formatacao.test.js
//   Formatação de Telefone
//     ✓ deve formatar telefone de 10 dígitos
//     ✓ deve formatar celular de 11 dígitos
//     ✓ deve formatar telefone já formatado

