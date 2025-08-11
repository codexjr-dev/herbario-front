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

    const fotosArray = [
      { url: form.imagemCapa.value, local: form.local?.value, data: form.data?.value ? new Date(form.data.value).toISOString() : null },
      { url: form.galeria1.value, local: form.local2?.value, data: form.data2?.value ? new Date(form.data2.value).toISOString() : null },
      { url: form.galeria2.value, local: form.local3?.value, data: form.data3?.value ? new Date(form.data3.value).toISOString() : null },
      { url: form.galeria3.value, local: form.local4?.value, data: form.data4?.value ? new Date(form.data4.value).toISOString() : null },
      { url: form.galeria4.value, local: form.local5?.value, data: form.data5?.value ? new Date(form.data5.value).toISOString() : null },
      { url: form.galeria5.value, local: form.local6?.value, data: form.data6?.value ? new Date(form.data6.value).toISOString() : null },
      { url: form.galeria6.value, local: form.local7?.value, data: form.data7?.value ? new Date(form.data7.value).toISOString() : null }
    ].filter(foto => foto.url && foto.url.trim() !== "");

    // Captura todos os glossários do formulário dinâmico
    const glossarioItems = document.querySelectorAll('#glossario-container .glossario-item');
    const glossary = Array.from(glossarioItems).map(item => ({
      term: item.querySelector('input[name="termoGlossario"]').value.trim(),
      description: item.querySelector('textarea[name="definicaoGlossario"]').value.trim()
    })).filter(g => g.term !== "" && g.description !== "");

    const data = {
      nomePopular: form.nomePopular.value,
      nomeCientifico: form.nomeCientifico.value,
      taxonomia: {
        reino: form.reino?.value || "",
        filo: form.filo?.value || "",
        classe: form.classe?.value || "",
        ordem: form.ordem.value,
        familia: form.familia.value,
        genero: form.genero?.value || "",
        especie: form.especie?.value || ""
      },
      fotos: fotosArray,
      descricao: form.descricao.value,
      usos: [""],  // Ajuste se quiser pegar do formulário
      duplicates: form.duplicatas.value,
      colectNumber: Number(form.numeroColeta.value) || null,
      colectDate: form.dataColeta.value ? new Date(form.dataColeta.value).toISOString() : null,
      local: form.localidade.value,
      collectors: [form.coletor.value],
      observations: form.observacoes.value,
      glossary: glossary,
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

      console.log('Resposta da API:', response.status);

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

  function preencherFormulario(planta) {
    form.nomePopular.value = planta.nomePopular || "";
    form.nomeCientifico.value = planta.nomeCientifico || "";
    form.reino.value = planta.taxonomia?.reino || "";
    form.filo.value = planta.taxonomia?.filo || "";
    form.classe.value = planta.taxonomia?.classe || "";
    form.ordem.value = planta.taxonomia?.ordem || "";
    form.familia.value = planta.taxonomia?.familia || "";
    form.genero.value = planta.taxonomia?.genero || "";
    form.especie.value = planta.taxonomia?.especie || "";

    if (planta.fotos && planta.fotos.length) {
      form.imagemCapa.value = planta.fotos[0]?.url || "";
      form.local.value = planta.fotos[0]?.local || "";
      form.data.value = planta.fotos[0]?.data ? new Date(planta.fotos[0].data).toISOString().split("T")[0] : "";

      for (let i = 1; i <= 6; i++) {
        form[`galeria${i}`].value = planta.fotos[i]?.url || "";
        form[`local${i + 1}`].value = planta.fotos[i]?.local || "";
        form[`data${i + 1}`].value = planta.fotos[i]?.data ? new Date(planta.fotos[i].data).toISOString().split("T")[0] : "";
      }
    }

    form.descricao.value = planta.descricao || "";
    form.duplicatas.value = planta.duplicates || "";
    form.numeroColeta.value = planta.colectNumber || "";
    form.dataColeta.value = planta.colectDate ? new Date(planta.colectDate).toISOString().split("T")[0] : "";
    form.localidade.value = planta.local || "";
    form.coletor.value = planta.collectors?.[0] || "";
    form.observacoes.value = planta.observations || "";

    // Preenche glossário dinâmico
    const glossarioContainer = document.getElementById('glossario-container');
    glossarioContainer.innerHTML = "";
    if (planta.glossary && planta.glossary.length > 0) {
      planta.glossary.forEach(item => {
        const glossarioItem = criarGlossarioItem(item.term, item.description);
        glossarioContainer.appendChild(glossarioItem);
      });
    } else {
      glossarioContainer.appendChild(criarGlossarioItem());
    }
  }

  // Função para criar novo bloco de glossário (precisa estar aqui para preencher)
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
      <button type="button" class="remover-glossario" title="Remover termo">X</button>
    `;

    container.querySelector('button.remover-glossario').addEventListener('click', () => {
      container.remove();
    });

    return container;
  }
});
