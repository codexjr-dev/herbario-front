const API_URL = 'http://localhost:3000/api/plants';
const AUTH_HEADER = {
  'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=',
  'Content-Type': 'application/json'
};

// LISTAR TODAS AS PLANTAS
function listarPlantas() {
  fetch(API_URL)
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar plantas');
      return res.json();
    })
    .then(data => {
      const tbody = document.getElementById('plantas-table-body');
      tbody.innerHTML = ''; // Limpa linhas antigas

      if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">Nenhuma planta cadastrada.</td></tr>`;
        return;
      }

      data.forEach(planta => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td>${planta.nomePopular}</td>
          <td>${planta.nomeCientifico}</td>
          <td>${planta.taxonomia?.familia || 'Desconhecida'}</td>
          <td>${planta.descricao || ''}</td>
          <td>
            <button onclick="buscarPlantaPorId('${planta._id}')">🔍 Ver</button>
            <button onclick="deletarPlanta('${planta._id}')">🗑️ Deletar</button>
          </td>
        `;

        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error(err);
      const tbody = document.getElementById('plantas-table-body');
      tbody.innerHTML = `<tr><td colspan="5">Erro ao carregar plantas.</td></tr>`;
    });
}



// BUSCAR UMA PLANTA POR ID
function buscarPlantaPorId(id) {
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(data => {
      console.log('Planta encontrada:', data);
    })
    .catch(err => console.error(`Erro ao buscar planta com ID ${id}:`, err));
}

// CRIAR UMA NOVA PLANTA
function criarPlanta(planta) {
  return fetch(API_URL, {
    method: 'POST',
    headers: AUTH_HEADER,
    body: JSON.stringify(planta)
  })
  .then(res => {
    if (!res.ok) throw new Error('Falha ao criar planta');
    return res.json();
  });
}

// ATUALIZAR UMA PLANTA EXISTENTE
function atualizarPlanta(id, planta) {
  fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: AUTH_HEADER,
    body: JSON.stringify(planta)
  })
    .then(res => res.json())
    .then(data => {
      console.log('Planta atualizada:', data);
    })
    .catch(err => console.error(`Erro ao atualizar planta com ID ${id}:`, err));
}

// DELETAR UMA PLANTA
function deletarPlanta(id) {
  fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: AUTH_HEADER
  })
    .then(res => res.json())
    .then(data => {
      console.log(`Planta com ID ${id} deletada:`, data);
    })
    .catch(err => console.error(`Erro ao deletar planta com ID ${id}:`, err));
}

// Chama para carregar a lista logo que a página abrir
listarPlantas();

document.getElementById('planta-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const nomePopular = document.getElementById('nomePopular').value.trim();
  const nomeCientifico = document.getElementById('nomeCientifico').value.trim();
  const familia = document.getElementById('familia').value.trim();
  const descricao = document.getElementById('descricao').value.trim();

  const novaPlanta = {
    nomePopular,
    nomeCientifico,
    taxonomia: { familia },
    descricao
  };

  criarPlanta(novaPlanta)
    .then(() => {
      this.reset();        // limpa formulário
      listarPlantas();     // atualiza tabela
    })
    .catch(err => {
      console.error('Erro ao criar planta:', err);
      alert('Erro ao criar planta. Veja o console para detalhes.');
    });
});


