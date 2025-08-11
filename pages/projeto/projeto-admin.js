const API_URL = "https://herbario-back.onrender.com/api/projetos";

const AUTH_HEADER = {
  'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=',
  'Content-Type': 'application/json'
};

 //Serve pra garantir que só possa entrar se tiver logado
 const token = localStorage.getItem('token');
 if (!token) {
  window.location.href = '/pages/login/login-admin.html';
}


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('parceiro-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const projeto = {
      descricao: document.getElementById('mapa-descricao').value.trim(),
      imagem: document.getElementById('imagem-url').value.trim(),
      imagemDescricao: document.getElementById('imagem-descricao').value.trim()
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: AUTH_HEADER,
        body: JSON.stringify(projeto)
      });

      if (!response.ok) {
        const erro = await response.json();
        alert(`Erro ao salvar projeto: ${erro.message || response.statusText}`);
        return;
      }

      alert('Projeto salvo com sucesso!');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('Erro ao se comunicar com o servidor.');
    }
  });
});
