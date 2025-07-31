  const API_URL = 'http://localhost:3000/api/plants';
  const AUTH_HEADER = {
    'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=',
    'Content-Type': 'application/json'
  };

  async function carregarPlantas() {
    try {
      const resposta = await fetch('http://localhost:3000/api/plantas', {
        headers: AUTH_HEADER
      });

      if (!resposta.ok) {
        throw new Error('Erro ao buscar plantas');
      }

      const plantas = await resposta.json();
      const corpoTabela = document.getElementById('plantas-table-body');
      corpoTabela.innerHTML = '';

      plantas.forEach(planta => {
        const linha = document.createElement('tr');

        // Coluna: nome popular da planta
        const tdNome = document.createElement('td');
        tdNome.textContent = planta.nomePopular;

        // Coluna: botões de ação
        const tdAcoes = document.createElement('td');
        tdAcoes.classList.add('botoes');

        // Botão Editar
        const botaoEditar = document.createElement('a');
        botaoEditar.href = `plantas-admin.html?id=${planta._id}`;
        botaoEditar.textContent = 'Editar';
        botaoEditar.className = 'button-editar';

        // Botão Excluir
        const botaoExcluir = document.createElement('button');
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.className = 'button-excluir';
        botaoExcluir.onclick = () => excluirPlanta(planta._id);

        tdAcoes.appendChild(botaoEditar);
        tdAcoes.appendChild(botaoExcluir);

        linha.appendChild(tdNome);
        linha.appendChild(tdAcoes);

        corpoTabela.appendChild(linha);
      });

    } catch (erro) {
      console.error(erro);
      alert('Erro ao carregar plantas.');
    }
  }

  async function excluirPlanta(id) {
    const confirmar = confirm('Tem certeza que deseja excluir esta planta?');
    if (!confirmar) return;

    try {
      const resposta = await fetch(`http://localhost:3000/api/plantas/${id}`, {
        method: 'DELETE',
        headers: AUTH_HEADER
      });

      if (!resposta.ok) {
        throw new Error('Erro ao excluir planta');
      }

      alert('Planta excluída com sucesso!');
      carregarPlantas(); // Recarrega lista após exclusão
    } catch (erro) {
      console.error(erro);
      alert('Erro ao excluir planta.');
    }
  }

  window.addEventListener('DOMContentLoaded', carregarPlantas);
