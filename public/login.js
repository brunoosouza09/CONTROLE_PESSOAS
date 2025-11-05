const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const loginBtn = document.getElementById('login-btn');

loginForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const senha = document.getElementById('senha').value;
    
    // Limpar erro anterior
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    
    // Validação básica
    if (!nome || !senha) {
        mostrarErro('Por favor, preencha todos os campos');
        return;
    }
    
    // Desabilitar botão
    loginBtn.disabled = true;
    loginBtn.textContent = 'Entrando...';
    
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ nome, senha })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            mostrarErro(data.error || 'Erro ao fazer login');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Entrar';
            return;
        }
        
        // Login bem-sucedido, redirecionar
        window.location.href = '/';
        
    } catch (err) {
        console.error('Erro no login:', err);
        mostrarErro('Erro de conexão. Tente novamente.');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Entrar';
    }
};

function mostrarErro(mensagem) {
    errorMessage.textContent = mensagem;
    errorMessage.classList.add('show');
}

