const API_BASE = window.location.origin + "/api/people";

const form = document.getElementById("person-form");
const tableBody = document.querySelector("#people-table tbody");
const rowTemplate = document.getElementById("row-template");
const reloadBtn = document.getElementById("reload-btn");
const resetBtn = document.getElementById("reset-btn");
const submitBtn = document.getElementById("submit-btn");
const editingId = document.getElementById("editing-id");

// Carregar lista
async function carregarPessoas() {
    try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error("Erro ao carregar dados");
        const pessoas = await res.json();
        tableBody.innerHTML = "";
        pessoas.forEach(pessoa => {
            const row = rowTemplate.content.cloneNode(true);
            row.querySelector(".col-id").textContent = pessoa.id;
            row.querySelector(".col-nome").textContent = pessoa.nome;
            row.querySelector(".col-email").textContent = pessoa.email;
            row.querySelector(".col-telefone").textContent = pessoa.telefone || "-";
            row.querySelector(".col-cpf").textContent = pessoa.cpf || "-";
            row.querySelector(".col-nascimento").textContent = pessoa.data_nascimento || "-";
            row.querySelector(".col-cidade").textContent = pessoa.cidade || "-";
            row.querySelector(".col-estado").textContent = pessoa.estado || "-";
            const editBtn = row.querySelector("[data-action='edit']");
            const deleteBtn = row.querySelector("[data-action='delete']");
            editBtn.onclick = () => preencherFormulario(pessoa);
            deleteBtn.onclick = () => excluirPessoa(pessoa.id);
            tableBody.appendChild(row);
        });
    } catch (err) {
        alert("Falha ao carregar");
        console.error(err);
    }
}

// Preencher formulário para edição
function preencherFormulario(pessoa) {
    document.getElementById("nome").value = pessoa.nome;
    document.getElementById("email").value = pessoa.email;
    document.getElementById("telefone").value = pessoa.telefone || "";
    document.getElementById("cpf").value = pessoa.cpf || "";
    document.getElementById("data_nascimento").value = pessoa.data_nascimento || "";
    document.getElementById("endereco").value = pessoa.endereco || "";
    document.getElementById("cidade").value = pessoa.cidade || "";
    document.getElementById("estado").value = pessoa.estado || "";
    document.getElementById("cep").value = pessoa.cep || "";
    document.getElementById("genero").value = pessoa.genero || "";
    editingId.value = pessoa.id;
    resetBtn.hidden = false;
    submitBtn.textContent = "Atualizar";
}

// Limpar formulário
function limparFormulario() {
    form.reset();
    editingId.value = "";
    resetBtn.hidden = true;
    submitBtn.textContent = "Salvar";
}

// Salvar ou atualizar pessoa
form.onsubmit = async (e) => {
    e.preventDefault();
    const dados = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        cpf: document.getElementById("cpf").value,
        data_nascimento: document.getElementById("data_nascimento").value,
        endereco: document.getElementById("endereco").value,
        cidade: document.getElementById("cidade").value,
        estado: document.getElementById("estado").value,
        cep: document.getElementById("cep").value,
        genero: document.getElementById("genero").value,
    };
    const id = editingId.value;
    const url = id ? `${API_BASE}/${id}` : API_BASE;
    const method = id ? "PUT" : "POST";
    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });
        if (!res.ok) throw new Error("Erro ao salvar");
        await carregarPessoas();
        limparFormulario();
    } catch (err) {
        alert("Falha ao salvar");
        console.error(err);
    }
};

// Excluir pessoa
async function excluirPessoa(id) {
    if (!confirm("Deseja realmente excluir este registro?")) return;
    try {
        const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Erro ao excluir");
        await carregarPessoas();
    } catch (err) {
        alert("Falha ao excluir");
        console.error(err);
    }
}

// Botões
reloadBtn.onclick = carregarPessoas;
resetBtn.onclick = limparFormulario;

// Inicialização
carregarPessoas();
