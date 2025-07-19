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
      const lista = document.getElementById('plantas-lista');
      lista.innerHTML = ''; // Limpa a lista anterior

      if (data.length === 0) {
        lista.innerHTML = '<li>Nenhuma planta cadastrada.</li>';
        return;
      }

      data.forEach(planta => {
        const item = document.createElement('li');
        item.innerHTML = `
          <strong>${planta.nomePopular}</strong> (${planta.nomeCientifico})<br/>
          Família: ${planta.taxonomia?.familia || 'Desconhecida'}<br/>
          ${planta.descricao || ''}
          <br/>
          <button onclick="buscarPlanta('${planta._id}')">🔍 Ver</button>
          <button onclick="deletarPlanta('${planta._id}')">🗑️ Deletar</button>
        `;
        lista.appendChild(item);
      });
    })
    .catch(err => {
      console.error(err);
      const lista = document.getElementById('plantas-lista');
      lista.innerHTML = '<li>Erro ao carregar plantas.</li>';
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
  fetch(API_URL, {
    method: 'POST',
    headers: AUTH_HEADER,
    body: JSON.stringify(planta)
  })
    .then(res => res.json())
    .then(data => {
      console.log('Planta criada:', data);
    })
    .catch(err => console.error('Erro ao criar planta:', err));
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
