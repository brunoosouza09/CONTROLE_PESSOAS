// Testes unitários para funções de validação

describe('Validações', () => {
  // Mock das funções de validação do backend
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarCPF = (cpf) => {
    if (!cpf) return true; // CPF é opcional
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(10))) return false;
    
    return true;
  };

  const validarTelefone = (telefone) => {
    if (!telefone) return true; // Telefone é opcional
    const telefoneLimpo = telefone.replace(/\D/g, '');
    return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
  };

  const validarCEP = (cep) => {
    if (!cep) return true; // CEP é opcional
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.length === 8;
  };

  describe('validarEmail', () => {
    test('deve aceitar email válido', () => {
      expect(validarEmail('teste@example.com')).toBe(true);
      expect(validarEmail('usuario@dominio.com.br')).toBe(true);
    });

    test('deve rejeitar email inválido', () => {
      expect(validarEmail('email-invalido')).toBe(false);
      expect(validarEmail('email@')).toBe(false);
      expect(validarEmail('@dominio.com')).toBe(false);
      expect(validarEmail('email sem @dominio.com')).toBe(false);
    });
  });

  describe('validarCPF', () => {
    test('deve aceitar CPF válido', () => {
      expect(validarCPF('12345678909')).toBe(true);
      expect(validarCPF('00000000000')).toBe(false); // Todos iguais
    });

    test('deve aceitar CPF vazio (opcional)', () => {
      expect(validarCPF('')).toBe(true);
      expect(validarCPF(null)).toBe(true);
    });

    test('deve rejeitar CPF inválido', () => {
      expect(validarCPF('123456789')).toBe(false); // Muito curto
      expect(validarCPF('123456789012')).toBe(false); // Muito longo
      expect(validarCPF('11111111111')).toBe(false); // Todos iguais
    });
  });

  describe('validarTelefone', () => {
    test('deve aceitar telefone válido (10 dígitos)', () => {
      expect(validarTelefone('1899999999')).toBe(true);
      expect(validarTelefone('(18) 9999-9999')).toBe(true);
    });

    test('deve aceitar celular válido (11 dígitos)', () => {
      expect(validarTelefone('18999999999')).toBe(true);
      expect(validarTelefone('(18) 99999-9999')).toBe(true);
    });

    test('deve aceitar telefone vazio (opcional)', () => {
      expect(validarTelefone('')).toBe(true);
      expect(validarTelefone(null)).toBe(true);
    });

    test('deve rejeitar telefone inválido', () => {
      expect(validarTelefone('12345')).toBe(false); // Muito curto
      expect(validarTelefone('189999999999')).toBe(false); // Muito longo
    });
  });

  describe('validarCEP', () => {
    test('deve aceitar CEP válido', () => {
      expect(validarCEP('19000000')).toBe(true);
      expect(validarCEP('19000-000')).toBe(true);
    });

    test('deve aceitar CEP vazio (opcional)', () => {
      expect(validarCEP('')).toBe(true);
      expect(validarCEP(null)).toBe(true);
    });

    test('deve rejeitar CEP inválido', () => {
      expect(validarCEP('12345')).toBe(false); // Muito curto
      expect(validarCEP('190000000')).toBe(false); // Muito longo
    });
  });
});

