const API_URL = 'http://localhost:3000/api/plants';
const AUTH_HEADER = {
  'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=',
  'Content-Type': 'application/json'
};

// ======= UTILS =======
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// ======= LISTAGEM =======
function listarPlantas() {
  fetch(API_URL, { headers: AUTH_HEADER })
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar plantas');
      return res.json();
    })
    .then(data => {
      const tbody = document.getElementById('plantas-table-body');
      if (!tbody) return; // não está na lista.html

      tbody.innerHTML = '';

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
          <td class="botoes">
            <button class="button-editar" onclick="editarPlanta('${planta._id}')">Editar</button>
            <button class="button-excluir" onclick="deletarPlanta('${planta._id}')">Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error(err);
      const tbody = document.getElementById('plantas-table-body');
      if (tbody) tbody.innerHTML = `<tr><td colspan="5">Erro ao carregar plantas.</td></tr>`;
    });
}

// ======= EDITAR E EXCLUIR =======
function editarPlanta(id) {
  window.location.href = `admin.html?editar=${encodeURIComponent(id)}`;
}

function deletarPlanta(id) {
  if (confirm('Tem certeza que deseja excluir esta planta?')) {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: AUTH_HEADER
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao deletar planta');
        alert('Planta deletada com sucesso!');
        listarPlantas();
      })
      .catch(err => {
        console.error(err);
        alert('Erro ao deletar planta. Veja o console.');
      });
  }
}

// ======= BUSCAR PLANTA (Edição) =======
function buscarPlantaPorId(id) {
  return fetch(`${API_URL}/${id}`, { headers: AUTH_HEADER })
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar planta');
      return res.json();
    });
}

// ======= CRIAR E ATUALIZAR =======
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

function atualizarPlanta(id, planta) {
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: AUTH_HEADER,
    body: JSON.stringify(planta)
  })
    .then(res => {
      if (!res.ok) throw new Error('Erro ao atualizar planta');
      return res.json();
    });
}

// ======= PREENCHE FORMULÁRIO SE EDITANDO =======
const editarId = getQueryParam('editar');

if (editarId) {
  buscarPlantaPorId(editarId)
    .then(planta => {
      document.getElementById('nomePopular').value = planta.nomePopular || '';
      document.getElementById('nomeCientifico').value = planta.nomeCientifico || '';
      document.getElementById('familia').value = planta.taxonomia?.familia || '';
      document.getElementById('descricao').value = planta.descricao || '';
      document.getElementById('imagemCapa').value = planta.imagemCapa || '';
      document.getElementById('especieTipo').value = planta.especieTipo || '';
      document.getElementById('ordem').value = planta.ordem || '';
      document.getElementById('duplicatas').value = planta.duplicatas || '';
      document.getElementById('numeroColeta').value = planta.numeroColeta || '';
      document.getElementById('dataColeta').value = planta.dataColeta ? planta.dataColeta.split('T')[0] : '';
      document.getElementById('localidade').value = planta.localidade || '';
      document.getElementById('coletor').value = planta.coletor || '';
      document.getElementById('observacoes').value = planta.observacoes || '';
      document.getElementById('termoGlossario').value = planta.termoGlossario || '';
      document.getElementById('definicaoGlossario').value = planta.definicaoGlossario || '';
      document.getElementById('galeria1').value = planta.galeria?.[0] || '';
      document.getElementById('galeria2').value = planta.galeria?.[1] || '';
      document.getElementById('galeria3').value = planta.galeria?.[2] || '';
      document.getElementById('galeria4').value = planta.galeria?.[3] || '';
      document.getElementById('galeria5').value = planta.galeria?.[4] || '';
      document.getElementById('galeria6').value = planta.galeria?.[5] || '';
    })
    .catch(err => {
      console.error('Erro ao carregar planta para edição:', err);
      alert('Erro ao carregar planta para edição.');
    });
}

// ======= EVENTO SUBMIT DO FORMULÁRIO =======
const form = document.getElementById('planta-form');

if (form) {
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const nomePopular = document.getElementById('nomePopular').value.trim();
    const nomeCientifico = document.getElementById('nomeCientifico').value.trim();
    const familia = document.getElementById('familia').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const imagemCapa = document.getElementById('imagemCapa').value.trim();
    const especieTipo = document.getElementById('especieTipo').value.trim();
    const ordem = document.getElementById('ordem').value.trim();
    const duplicatas = document.getElementById('duplicatas').value.trim();
    const numeroColeta = document.getElementById('numeroColeta').value.trim();
    const dataColeta = document.getElementById('dataColeta').value;
    const localidade = document.getElementById('localidade').value.trim();
    const coletor = document.getElementById('coletor').value.trim();
    const observacoes = document.getElementById('observacoes').value.trim();
    const termoGlossario = document.getElementById('termoGlossario').value.trim();
    const definicaoGlossario = document.getElementById('definicaoGlossario').value.trim();
    const galeria = [
      document.getElementById('galeria1').value.trim(),
      document.getElementById('galeria2').value.trim(),
      document.getElementById('galeria3').value.trim(),
      document.getElementById('galeria4').value.trim(),
      document.getElementById('galeria5').value.trim(),
      document.getElementById('galeria6').value.trim(),
    ].filter(url => url !== '');

    const plantaData = {
      nomePopular,
      nomeCientifico,
      taxonomia: { familia },
      descricao,
      imagemCapa,
      especieTipo,
      ordem,
      duplicatas,
      numeroColeta,
      dataColeta,
      localidade,
      coletor,
      observacoes,
      termoGlossario,
      definicaoGlossario,
      galeria
    };

    if (editarId) {
      atualizarPlanta(editarId, plantaData)
        .then(() => {
          alert('Planta atualizada com sucesso!');
          window.location.href = 'lista.html';
        })
        .catch(err => {
          console.error('Erro ao atualizar planta:', err);
          alert('Erro ao atualizar planta.');
        });
    } else {
      criarPlanta(plantaData)
        .then(() => {
          alert('Planta criada com sucesso!');
          window.location.href = 'lista.html';
        })
        .catch(err => {
          console.error('Erro ao criar planta:', err);
          alert('Erro ao criar planta.');
        });
    }
  });
}

// ======= EXECUTA LISTAR PLANTAS NA lista.html =======
listarPlantas();
