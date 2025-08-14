const API_URL = "https://herbario-back.onrender.com/api/plants";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("planta-form");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa fazer login novamente.");
    window.location.href = '/pages/login/login-admin.html';
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const plantaId = urlParams.get("id");

  if (plantaId) {
    fetch(`${API_URL}/${plantaId}`, {
      method: "GET",
      headers: { "Authorization": `Basic ${token}` }
    })
      .then(res => res.json())
      .then(planta => preencherFormulario(planta))
      .catch(err => console.error("Erro ao carregar planta:", err));
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Fotos
    const fotosArray = [];
    const capa = form.capaPlanta.value;
    if (capa) fotosArray.push({ url: capa });
    for (let i = 1; i <= 6; i++) {
      const input = form[`foto${i}`];
      if (input && input.value.trim() !== "") {
        fotosArray.push({ url: input.value.trim() });
      }
    }

    // Glossário
    const glossarioItems = document.querySelectorAll('#glossario-container .glossario-item');
    const glossary = Array.from(glossarioItems).map(item => ({
      term: item.querySelector('input[name="termoGlossario"]').value.trim(),
      description: item.querySelector('textarea[name="definicaoGlossario"]').value.trim()
    })).filter(g => g.term && g.description);

    // Coletores
    const coletorInputs = document.querySelectorAll('#coletores-container input[name="collectors[]"]');
    const collectors = Array.from(coletorInputs).map(input => input.value.trim()).filter(c => c);

    // Dados do formulário
    const data = {
      nomePopular: form.nomePopular.value.trim(),
      nomeCientifico: form.nomeCientifico.value.trim(),
      taxonomia: {
        reino: form.reino?.value || "Plantae",
        filo: form.filo?.value || "",
        classe: form.classe?.value || "",
        ordem: form.ordem?.value || "",
        familia: form.familia?.value || "",
        genero: form.genero?.value || "",
        especie: form.especie?.value || ""
      },
      fotos: fotosArray,
      descricao: form.descricao.value.trim(),
      duplicates: form.duplicates.value.trim() || "",
      colectNumber: form.collectNumber.value ? Number(form.collectNumber.value) : null,
      colectDate: form.colectDate.value ? new Date(form.colectDate.value).toISOString() : null,
      local: form.local.value.trim() || "",
      collectors,
      glossary
    };

    try {
      const response = await fetch(plantaId ? `${API_URL}/${plantaId}` : API_URL, {
        method: plantaId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const erroTexto = await response.text();
        console.error("Erro na resposta da API:", erroTexto);
        alert("Erro ao salvar planta: " + erroTexto);
        return;
      }

      alert(plantaId ? "Planta atualizada com sucesso!" : "Planta cadastrada com sucesso!");
      window.location.href = "/pages/lista-plantas/lista-plantas-admin.html";
    } catch (error) {
      alert("Erro ao enviar dados: " + error.message);
      console.error(error);
    }
  });

  // Funções auxiliares
  function preencherFormulario(planta) {
    form.nomePopular.value = planta.nomePopular || "";
    form.nomeCientifico.value = planta.nomeCientifico || "";
    form.reino.value = planta.taxonomia?.reino || "Plantae";
    form.filo.value = planta.taxonomia?.filo || "";
    form.classe.value = planta.taxonomia?.classe || "";
    form.ordem.value = planta.taxonomia?.ordem || "";
    form.familia.value = planta.taxonomia?.familia || "";
    form.genero.value = planta.taxonomia?.genero || "";
    form.especie.value = planta.taxonomia?.especie || "";

    form.capaPlanta.value = planta.fotos?.[0]?.url || "";
    for (let i = 1; i <= 6; i++) {
      const input = form[`foto${i}`];
      if (input) input.value = planta.fotos?.[i]?.url || "";
    }

    form.descricao.value = planta.descricao || "";
    form.duplicates.value = planta.duplicates || "";
    form.collectNumber.value = planta.colectNumber || "";
    form.colectDate.value = planta.colectDate ? new Date(planta.colectDate).toISOString().split("T")[0] : "";
    form.local.value = planta.local || "";

    // Coletores
    const coletoresContainer = document.getElementById('coletores-container');
    coletoresContainer.innerHTML = "";
    if (planta.collectors?.length) {
      planta.collectors.forEach((c, i) => {
        const item = criarItemDinamico({
          label1: `Coletor ${i + 1}`,
          nome1: 'collectors[]',
          valor1: c,
          containerId: 'coletores-container',
          tipo: 'coletor'
        });
        coletoresContainer.appendChild(item);
      });
    } else {
      coletoresContainer.appendChild(criarItemDinamico({
        label1: 'Coletor 1',
        nome1: 'collectors[]',
        containerId: 'coletores-container',
        tipo: 'coletor'
      }));
    }

    // Glossário
    const glossarioContainer = document.getElementById('glossario-container');
    glossarioContainer.innerHTML = "";
    if (planta.glossary?.length) {
      planta.glossary.forEach(g => {
        const item = criarGlossarioItem(g.term, g.description);
        glossarioContainer.appendChild(item);
      });
    } else {
      glossarioContainer.appendChild(criarGlossarioItem());
    }
  }

  function criarItemDinamico(config) {
    const container = document.createElement('div');
    container.className = 'item-dinamico';
    const { label1, nome1, valor1 = '', label2, nome2, valor2 = '' } = config;

    let html = `<label class="rotulo-item">${label1}:</label>
                <input type="text" name="${nome1}" value="${valor1}" required />`;
    if (nome2) {
      html += `<label>${label2}:
                 <textarea name="${nome2}" rows="3" required>${valor2}</textarea>
               </label>`;
    }

    container.innerHTML = html + 
      `<div class="botoes-item">
         <button type="button" class="adicionar" title="Adicionar">+</button>
         <button type="button" class="remover" title="Remover">x</button>
       </div>`;

    container.querySelector('.adicionar').addEventListener('click', () => {
      const novoItem = criarItemDinamico(config);
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
    itens.forEach((item, index) => {
      item.querySelector('.rotulo-item').textContent = `Coletor ${index + 1}:`;
    });
  }

  function criarGlossarioItem(term = '', description = '') {
    const container = document.createElement('div');
    container.className = 'glossario-item';
    container.innerHTML = `
      <label>Termo:
        <input type="text" name="termoGlossario" value="${term}" required />
      </label>
      <label>Definição:
        <textarea name="definicaoGlossario" rows="3" required>${description}</textarea>
      </label>
      <button type="button" class="remover-glossario">X</button>
    `;
    container.querySelector('.remover-glossario').addEventListener('click', () => container.remove());
    return container;
  }
});
