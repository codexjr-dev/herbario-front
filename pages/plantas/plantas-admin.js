const API_URL = "https://herbario-back.onrender.com/api/plants";
const imagemPadrao = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpttnfhDbmXTkbWTyJU_fotk6nrElsiG2Vng&s";


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("planta-form");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa fazer login novamente.");
    window.location.href = '/pages/login/login-admin.html';
    return;
  }

  const plantaId = getPlantaId();

  // Se houver ID, carrega os dados da planta
  if (plantaId) {
    carregarPlantaParaEdicao(plantaId, token);
  }

  // Submit do formulário
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fotosArray = [];
    if (form.capaPlanta.value) fotosArray.push({ url: form.capaPlanta.value });
    for (let i = 1; i <= 6; i++) {
      const input = form[`foto${i}`];
      if (input && input.value.trim()) fotosArray.push({ url: input.value.trim() });
    }

    const collectors = Array.from(document.querySelectorAll('#coletores-container input[name="collectors[]"]'))
      .map(input => input.value.trim()).filter(c => c);

    const glossary = Array.from(document.querySelectorAll('#glossario-container .item-dinamico'))
      .map(item => ({
        term: item.querySelector('input[name="glossary[].term"]').value.trim(),
        description: item.querySelector('textarea[name="glossary[].description"]').value.trim()
      }))
      .filter(g => g.term && g.description);

    const data = {
      nomePopular: form.nomePopular.value.trim(),
      nomeCientifico: form.nomeCientifico.value.trim(),
      taxonomia: {
        classe: form.classe.value.trim(),
        ordem: form.ordem.value.trim(),
        familia: form.familia.value.trim(),
        especie: form.especieTipo.value.trim()
      },
      fotos: fotosArray,
      descricao: form.descricao.value.trim(),
      duplicates: form.duplicates.value.trim(),
      colectNumber: form.colectNumber.value ? Number(form.colectNumber.value) : null,
      colectDate: form.colectDate.value ? new Date(form.colectDate.value).toISOString() : null,
      local: form.local.value.trim(),
      collectors,
      glossary
    };

    try {
      const response = await fetch(plantaId ? `${API_URL}/${plantaId}` : API_URL, {
        method: plantaId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Basic ${token}` },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const erroTexto = await response.text();
        alert("Erro ao salvar planta: " + erroTexto);
        return;
      }

      alert(plantaId ? "Planta atualizada com sucesso!" : "Planta cadastrada com sucesso!");
      window.location.href = "/pages/lista-plantas/lista-plantas-admin.html";
    } catch (error) {
      alert("Erro ao enviar dados: " + error.message);
    }
  });

  // Funções auxiliares
  function getPlantaId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  async function carregarPlantaParaEdicao(id, token) {
    try {
      const resposta = await fetch(`${API_URL}/${id}`, { headers: { "Authorization": `Basic ${token}` } });
      if (!resposta.ok) throw new Error("Erro ao buscar planta");

      const planta = await resposta.json();
      preencherFormulario(planta);
    } catch (erro) {
      console.error(erro);
      alert("Erro ao carregar planta para edição.");
    }
  }

  function preencherFormulario(planta) {
    const form = document.getElementById("planta-form");

    // Campos simples
    form.nomePopular.value = planta.nomePopular || '';
    form.capaPlanta.value = planta.fotos?.[0]?.url || imagemPadrao;
    form.descricao.value = planta.descricao || '';
    form.nomeCientifico.value = planta.nomeCientifico || '';
    form.classe.value = planta.taxonomia?.classe || '';
    form.ordem.value = planta.taxonomia?.ordem || '';
    form.familia.value = planta.taxonomia?.familia || '';
    form.especieTipo.value = planta.taxonomia?.especie || '';
    form.colectNumber.value = planta.colectNumber || '';
    form.colectDate.value = planta.colectDate ? new Date(planta.colectDate).toISOString().split('T')[0] : '';
    form.local.value = planta.local || '';
    form.duplicates.value = planta.duplicates || '';
    form.foto1.value = planta.fotos?.[1]?.url || imagemPadrao;
    form.foto2.value = planta.fotos?.[2]?.url || imagemPadrao;
    form.foto3.value = planta.fotos?.[3]?.url || imagemPadrao;
    form.foto4.value = planta.fotos?.[4]?.url || imagemPadrao;
    form.foto5.value = planta.fotos?.[5]?.url || imagemPadrao;
    form.foto6.value = planta.fotos?.[6]?.url || imagemPadrao;

    // Coletores
    const coletoresContainer = document.getElementById('coletores-container');
    coletoresContainer.innerHTML = '';
    if (planta.collectors?.length) {
      planta.collectors.forEach((c, i) => {
        const item = criarItemDinamico({ label1: `Coletor ${i+1}`, nome1: 'collectors[]', valor1: c, containerId: 'coletores-container', tipo: 'coletor' });
        coletoresContainer.appendChild(item);
      });
    } else {
      coletoresContainer.appendChild(criarItemDinamico({ label1: 'Coletor 1', nome1: 'collectors[]', containerId: 'coletores-container', tipo: 'coletor' }));
    }
    atualizarNumeracaoColetores();

    // Glossário
    const glossarioContainer = document.getElementById('glossario-container');
    glossarioContainer.innerHTML = '';
    if (planta.glossary?.length) {
      planta.glossary.forEach(g => {
        const item = criarItemDinamico({ label1: 'Termo', nome1: 'glossary[].term', valor1: g.term, label2: 'Definição', nome2: 'glossary[].description', valor2: g.description, containerId: 'glossario-container', tipo: 'glossario' });
        glossarioContainer.appendChild(item);
      });
    } else {
      glossarioContainer.appendChild(criarItemDinamico({ label1: 'Termo', nome1: 'glossary[].term', label2: 'Definição', nome2: 'glossary[].description', containerId: 'glossario-container', tipo: 'glossario' }));
    }
  }

  function criarItemDinamico(config) {
  const container = document.createElement('div');
  container.className = 'item-dinamico';
  const { label1, nome1, valor1 = '', label2, nome2, valor2 = '' } = config;

  let html = `<label class="rotulo-item">${label1}:</label>
              <input type="text" name="${nome1}" value="${valor1}" />`;
  if (nome2) html += `<label>${label2}:
                        <textarea name="${nome2}" rows="3" >${valor2}</textarea>
                      </label>`;

  container.innerHTML = html + `<div class="botoes-item">
                                  <button type="button" class="adicionar" title="Adicionar">+</button>
                                  <button type="button" class="remover" title="Remover">x</button>
                                </div>`;

  container.querySelector('.adicionar').addEventListener('click', () => {
    // Cria um novo config "limpo" (sem valores preenchidos)
    const novoConfig = { ...config, valor1: '', valor2: '' };
    const novoItem = criarItemDinamico(novoConfig);
    container.insertAdjacentElement('afterend', novoItem);
    if (config.tipo === 'coletor') atualizarNumeracaoColetores();
  });

  container.querySelector('.remover').addEventListener('click', () => {
    const parentContainer = document.getElementById(config.containerId);
    if (parentContainer.children.length > 1) {
      container.remove();
      if (config.tipo === 'coletor') atualizarNumeracaoColetores();
    } else {
      alert('É necessário ter pelo menos um item.');
    }
  });

  return container;
}


  function atualizarNumeracaoColetores() {
    const itens = document.querySelectorAll('#coletores-container .item-dinamico');
    itens.forEach((item, index) => item.querySelector('.rotulo-item').textContent = `Coletor ${index+1}:`);
  }
});
