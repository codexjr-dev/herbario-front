const API_URL = "https://herbario-back.onrender.com/api/parceiros";

// Pega token do localStorage e verifica login
const token = localStorage.getItem('token');
if (!token) {
  alert("Usuário não autenticado. Faça login.");
  window.location.href = '/pages/login/login-admin.html';
}

async function carregarParceiros() {
  try {
    const resposta = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${token}`
      }
    });

    if (!resposta.ok) {
      throw new Error('Erro ao buscar parceiros');
    }

    const parceiros = await resposta.json();
    const corpoTabela = document.getElementById('parceiros-table-body');
    corpoTabela.innerHTML = '';

    parceiros.forEach(parceiro => {
      const linha = document.createElement('tr');

      // Coluna com o nome do parceiro
      const tdNome = document.createElement('td');
      tdNome.textContent = parceiro.nome;

      // Coluna com os botões
      const tdAcoes = document.createElement('td');
      tdAcoes.classList.add('botoes');

      // Botão Editar
      const botaoEditar = document.createElement('a');
      botaoEditar.href = `/pages/parceiros/parceiros-admin.html?id=${parceiro._id}`;
      botaoEditar.textContent = 'Editar';
      botaoEditar.className = 'button-editar';

      // Botão Excluir
      const botaoExcluir = document.createElement('button');
      botaoExcluir.textContent = 'Excluir';
      botaoExcluir.className = 'button-excluir';
      botaoExcluir.onclick = () => excluirParceiro(parceiro._id);

      // Adiciona os botões à coluna de ações
      tdAcoes.appendChild(botaoEditar);
      tdAcoes.appendChild(botaoExcluir);

      // Adiciona colunas à linha
      linha.appendChild(tdNome);
      linha.appendChild(tdAcoes);

      // Adiciona a linha à tabela
      corpoTabela.appendChild(linha);
    });

  } catch (erro) {
    console.error(erro);
    alert('Erro ao carregar parceiros.');
  }
}

async function excluirParceiro(id) {
  const confirmacao = confirm('Tem certeza que deseja excluir este parceiro?');
  if (!confirmacao) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${token}`
      }
    });

    if (!resposta.ok) {
      throw new Error('Erro ao excluir parceiro');
    }

    alert('Parceiro excluído com sucesso!');
    carregarParceiros(); // Recarrega a lista
  } catch (erro) {
    console.error(erro);
    alert('Erro ao excluir parceiro.');
  }
}

// Carrega a lista ao abrir a página
window.addEventListener('DOMContentLoaded', carregarParceiros);
