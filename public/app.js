const api = {
	base: '',
	async list() {
		const res = await fetch('/api/people');
		if (!res.ok) throw new Error('Falha ao carregar');
		return res.json();
	},
	async create(data) {
		const res = await fetch('/api/people', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
		if (!res.ok) throw new Error('Falha ao salvar');
		return res.json();
	},
	async update(id, data) {
		const res = await fetch(`/api/people/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
		if (!res.ok) throw new Error('Falha ao atualizar');
		return res.json();
	},
	async remove(id) {
		const res = await fetch(`/api/people/${id}`, { method: 'DELETE' });
		if (!res.ok) throw new Error('Falha ao excluir');
	}
};

const form = document.getElementById('person-form');
const nome = document.getElementById('nome');
const email = document.getElementById('email');
const telefone = document.getElementById('telefone');
const cpf = document.getElementById('cpf');
const dataNascimento = document.getElementById('data_nascimento');
const endereco = document.getElementById('endereco');
const cidade = document.getElementById('cidade');
const estado = document.getElementById('estado');
const cep = document.getElementById('cep');
const genero = document.getElementById('genero');
const editingId = document.getElementById('editing-id');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const reloadBtn = document.getElementById('reload-btn');
const tableBody = document.querySelector('#people-table tbody');
const rowTpl = document.getElementById('row-template');

function clearForm() {
	form.reset();
	editingId.value = '';
	submitBtn.textContent = 'Salvar';
	resetBtn.hidden = true;
}

function fillForm(p) {
	editingId.value = p.id;
	nome.value = p.nome;
	email.value = p.email;
    telefone.value = p.telefone || '';
    cpf.value = p.cpf || '';
    dataNascimento.value = p.data_nascimento ? String(p.data_nascimento).slice(0,10) : '';
    endereco.value = p.endereco || '';
    cidade.value = p.cidade || '';
    estado.value = p.estado || '';
    cep.value = p.cep || '';
    genero.value = p.genero || '';
	submitBtn.textContent = 'Atualizar';
	resetBtn.hidden = false;
}

async function loadTable() {
	submitBtn.disabled = true;
	reloadBtn.disabled = true;
	try {
		const people = await api.list();
		tableBody.innerHTML = '';
		for (const p of people) {
			const tr = rowTpl.content.firstElementChild.cloneNode(true);
			tr.querySelector('.col-id').textContent = p.id;
			tr.querySelector('.col-nome').textContent = p.nome;
			tr.querySelector('.col-email').textContent = p.email;
            tr.querySelector('.col-telefone').textContent = p.telefone || '';
            tr.querySelector('.col-cpf').textContent = p.cpf || '';
            tr.querySelector('.col-nascimento').textContent = p.data_nascimento ? String(p.data_nascimento).slice(0,10) : '';
            tr.querySelector('.col-cidade').textContent = p.cidade || '';
            tr.querySelector('.col-estado').textContent = p.estado || '';
			tr.querySelector('[data-action="edit"]').addEventListener('click', () => fillForm(p));
			tr.querySelector('[data-action="delete"]').addEventListener('click', async () => {
				if (!confirm('Confirmar exclusão?')) return;
				await api.remove(p.id);
				await loadTable();
				if (editingId.value === String(p.id)) clearForm();
			});
			tableBody.appendChild(tr);
		}
	} catch (e) {
		alert(e.message);
	} finally {
		submitBtn.disabled = false;
		reloadBtn.disabled = false;
	}
}

form.addEventListener('submit', async (e) => {
	e.preventDefault();
    const data = {
        nome: nome.value.trim(),
        email: email.value.trim(),
        telefone: telefone.value.trim() || null,
        cpf: cpf.value.trim() || null,
        data_nascimento: dataNascimento.value || null,
        endereco: endereco.value.trim() || null,
        cidade: cidade.value.trim() || null,
        estado: estado.value.trim() || null,
        cep: cep.value.trim() || null,
        genero: genero.value || null,
    };
	if (!data.nome || !data.email) return;

	submitBtn.disabled = true;
	try {
		if (editingId.value) {
			await api.update(editingId.value, data);
		} else {
			await api.create(data);
		}
		clearForm();
		await loadTable();
	} catch (e) {
		alert(e.message);
	} finally {
		submitBtn.disabled = false;
	}
});

resetBtn.addEventListener('click', clearForm);
reloadBtn.addEventListener('click', loadTable);

loadTable();




