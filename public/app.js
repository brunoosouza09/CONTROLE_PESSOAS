const API_BASE = window.location.origin + "/api/people";

const form = document.getElementById("person-form");
const tableBody = document.querySelector("#people-table tbody");
const rowTemplate = document.getElementById("row-template");
const reloadBtn = document.getElementById("reload-btn");
const resetBtn = document.getElementById("reset-btn");
const submitBtn = document.getElementById("submit-btn");
const editingId = document.getElementById("editing-id");

// Verificar autenticação ao carregar
async function verificarAutenticacao() {
    try {
        const res = await fetch('/api/auth/check', {
            credentials: 'include'
        });
        const data = await res.json();
        if (!data.authenticated) {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        window.location.href = '/login.html';
        return false;
    }
}

// Funções de validação
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarCPF(cpf) {
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
}

function validarTelefone(telefone) {
    if (!telefone) return true;
    const telefoneLimpo = telefone.replace(/\D/g, '');
    return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
}

function validarCEP(cep) {
    if (!cep) return true;
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.length === 8;
}

function formatarTelefone(value) {
    const digits = value.replace(/\D/g, '');
    // Limitar a 11 dígitos (máximo para celular brasileiro)
    const limitedDigits = digits.slice(0, 11);
    
    if (limitedDigits.length <= 10) {
        // Telefone fixo: (99) 9999-9999
        if (limitedDigits.length <= 2) {
            return limitedDigits.length > 0 ? `(${limitedDigits}` : '';
        } else if (limitedDigits.length <= 6) {
            return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2)}`;
        } else {
            return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2, 6)}-${limitedDigits.slice(6)}`;
        }
    } else {
        // Celular: (99) 99999-9999
        if (limitedDigits.length <= 2) {
            return limitedDigits.length > 0 ? `(${limitedDigits}` : '';
        } else if (limitedDigits.length <= 7) {
            return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2)}`;
        } else {
            return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2, 7)}-${limitedDigits.slice(7)}`;
        }
    }
}

function formatarCPF(value) {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarCEP(value) {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
}

function mostrarErro(mensagem) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    notification.textContent = mensagem;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Validação em tempo real
document.getElementById('telefone').addEventListener('input', (e) => {
    e.target.value = formatarTelefone(e.target.value);
});

document.getElementById('cpf').addEventListener('input', (e) => {
    e.target.value = formatarCPF(e.target.value);
});

document.getElementById('cep').addEventListener('input', (e) => {
    e.target.value = formatarCEP(e.target.value);
});

document.getElementById('estado').addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
});

// Carregar lista
async function carregarPessoas() {
    try {
        const res = await fetch(API_BASE, {
            credentials: 'include'
        });
        if (!res.ok) {
            if (res.status === 401) {
                window.location.href = '/login.html';
                return;
            }
            throw new Error("Erro ao carregar dados");
        }
        const pessoas = await res.json();
        tableBody.innerHTML = "";
        if (pessoas.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="9" style="text-align: center; padding: 2rem;">Nenhuma pessoa cadastrada</td>';
            tableBody.appendChild(row);
            return;
        }
        pessoas.forEach(pessoa => {
            const row = rowTemplate.content.cloneNode(true);
            row.querySelector(".col-id").textContent = pessoa.id;
            row.querySelector(".col-nome").textContent = pessoa.nome || "-";
            row.querySelector(".col-email").textContent = pessoa.email || "-";
            
            // Formatar telefone para exibição
            let telefoneFormatado = "-";
            if (pessoa.telefone) {
                const tel = pessoa.telefone.replace(/\D/g, '');
                if (tel.length === 10) {
                    telefoneFormatado = tel.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else if (tel.length === 11) {
                    telefoneFormatado = tel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else {
                    telefoneFormatado = pessoa.telefone;
                }
            }
            row.querySelector(".col-telefone").textContent = telefoneFormatado;
            
            // Formatar CPF para exibição
            let cpfFormatado = "-";
            if (pessoa.cpf) {
                const cpf = pessoa.cpf.replace(/\D/g, '');
                if (cpf.length === 11) {
                    cpfFormatado = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                } else {
                    cpfFormatado = pessoa.cpf;
                }
            }
            row.querySelector(".col-cpf").textContent = cpfFormatado;
            
            // Formatar data de nascimento
            let dataFormatada = "-";
            if (pessoa.data_nascimento) {
                try {
                    const data = new Date(pessoa.data_nascimento);
                    if (!isNaN(data.getTime())) {
                        dataFormatada = data.toLocaleDateString('pt-BR');
                    } else {
                        dataFormatada = pessoa.data_nascimento;
                    }
                } catch (e) {
                    dataFormatada = pessoa.data_nascimento;
                }
            }
            row.querySelector(".col-nascimento").textContent = dataFormatada;
            
            row.querySelector(".col-cidade").textContent = pessoa.cidade || "-";
            row.querySelector(".col-estado").textContent = pessoa.estado || "-";
            const editBtn = row.querySelector("[data-action='edit']");
            const deleteBtn = row.querySelector("[data-action='delete']");
            editBtn.onclick = () => preencherFormulario(pessoa);
            deleteBtn.onclick = () => excluirPessoa(pessoa.id);
            tableBody.appendChild(row);
        });
    } catch (err) {
        mostrarErro("Falha ao carregar dados");
        console.error(err);
    }
}

// Preencher formulário para edição
function preencherFormulario(pessoa) {
    document.getElementById("nome").value = pessoa.nome || "";
    document.getElementById("email").value = pessoa.email || "";
    
    // Formatar telefone para o campo
    let telefoneFormatado = "";
    if (pessoa.telefone) {
        const tel = pessoa.telefone.replace(/\D/g, '');
        if (tel.length === 10) {
            telefoneFormatado = tel.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else if (tel.length === 11) {
            telefoneFormatado = tel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else {
            telefoneFormatado = pessoa.telefone;
        }
    }
    document.getElementById("telefone").value = telefoneFormatado;
    
    // Formatar CPF para o campo
    let cpfFormatado = "";
    if (pessoa.cpf) {
        const cpf = pessoa.cpf.replace(/\D/g, '');
        if (cpf.length === 11) {
            cpfFormatado = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else {
            cpfFormatado = pessoa.cpf;
        }
    }
    document.getElementById("cpf").value = cpfFormatado;
    
    // Formatar CEP para o campo
    let cepFormatado = "";
    if (pessoa.cep) {
        const cep = pessoa.cep.replace(/\D/g, '');
        if (cep.length === 8) {
            cepFormatado = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
        } else {
            cepFormatado = pessoa.cep;
        }
    }
    document.getElementById("cep").value = cepFormatado;
    
    document.getElementById("data_nascimento").value = pessoa.data_nascimento ? pessoa.data_nascimento.split('T')[0] : "";
    document.getElementById("endereco").value = pessoa.endereco || "";
    document.getElementById("cidade").value = pessoa.cidade || "";
    document.getElementById("estado").value = pessoa.estado || "";
    document.getElementById("genero").value = pessoa.genero || "";
    editingId.value = pessoa.id;
    resetBtn.hidden = false;
    submitBtn.textContent = "Atualizar";
    form.scrollIntoView({ behavior: 'smooth' });
}

// Limpar formulário
function limparFormulario() {
    form.reset();
    editingId.value = "";
    resetBtn.hidden = true;
    submitBtn.textContent = "Salvar";
}

// Validar formulário
function validarFormulario() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value;
    const cpf = document.getElementById("cpf").value;
    const cep = document.getElementById("cep").value;
    const estado = document.getElementById("estado").value.trim();
    
    if (!nome || nome.length < 3) {
        mostrarErro("Nome deve ter pelo menos 3 caracteres");
        return false;
    }
    
    if (!email) {
        mostrarErro("Email é obrigatório");
        return false;
    }
    
    if (!validarEmail(email)) {
        mostrarErro("Email inválido");
        return false;
    }
    
    if (cpf && !validarCPF(cpf)) {
        mostrarErro("CPF inválido");
        return false;
    }
    
    if (telefone && !validarTelefone(telefone)) {
        mostrarErro("Telefone inválido (deve ter 10 ou 11 dígitos)");
        return false;
    }
    
    if (cep && !validarCEP(cep)) {
        mostrarErro("CEP inválido (deve ter 8 dígitos)");
        return false;
    }
    
    if (estado && estado.length !== 2) {
        mostrarErro("Estado deve ter 2 caracteres (UF)");
        return false;
    }
    
    return true;
}

// Salvar ou atualizar pessoa
form.onsubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
        return;
    }
    
    const dados = {
        nome: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim(),
        telefone: document.getElementById("telefone").value,
        cpf: document.getElementById("cpf").value,
        data_nascimento: document.getElementById("data_nascimento").value,
        endereco: document.getElementById("endereco").value.trim(),
        cidade: document.getElementById("cidade").value.trim(),
        estado: document.getElementById("estado").value.toUpperCase().trim(),
        cep: document.getElementById("cep").value,
        genero: document.getElementById("genero").value,
    };
    
    const id = editingId.value;
    const url = id ? `${API_BASE}/${id}` : API_BASE;
    const method = id ? "PUT" : "POST";
    
    submitBtn.disabled = true;
    submitBtn.textContent = id ? "Atualizando..." : "Salvando...";
    
    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(dados),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            if (res.status === 401) {
                window.location.href = '/login.html';
                return;
            }
            throw new Error(data.error || "Erro ao salvar");
        }
        
        await carregarPessoas();
        limparFormulario();
        mostrarSucesso(id ? "Pessoa atualizada com sucesso!" : "Pessoa cadastrada com sucesso!");
    } catch (err) {
        mostrarErro(err.message || "Falha ao salvar");
        console.error(err);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = id ? "Atualizar" : "Salvar";
    }
};

// Excluir pessoa
async function excluirPessoa(id) {
    if (!confirm("Deseja realmente excluir este registro?")) return;
    try {
        const res = await fetch(`${API_BASE}/${id}`, { 
            method: "DELETE",
            credentials: 'include'
        });
        if (!res.ok) {
            if (res.status === 401) {
                window.location.href = '/login.html';
                return;
            }
            throw new Error("Erro ao excluir");
        }
        await carregarPessoas();
        mostrarSucesso("Pessoa excluída com sucesso!");
    } catch (err) {
        mostrarErro("Falha ao excluir");
        console.error(err);
    }
}

// Logout
async function fazerLogout() {
    try {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        window.location.href = '/login.html';
    } catch (err) {
        console.error('Erro ao fazer logout:', err);
        window.location.href = '/login.html';
    }
}

function mostrarSucesso(mensagem) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #22c55e;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    notification.textContent = mensagem;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Botões
reloadBtn.onclick = carregarPessoas;
resetBtn.onclick = limparFormulario;

// Inicialização
(async () => {
    const autenticado = await verificarAutenticacao();
    if (autenticado) {
        carregarPessoas();
    }
})();
