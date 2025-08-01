const API_URL = process.env.PORT;
require("dotenv").config();

const AUTH_HEADER = {
  'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=',
  'Content-Type': 'application/json'
};

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
      const response = await fetch('http://localhost:3000/projetos', {
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
