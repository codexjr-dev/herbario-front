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

    const fotosArray = [];
    for (let i = 0; i <= 6; i++) {
      const url = form[`foto${i}`]?.value || form[`imagemCapa`]?.value;
      if (url && url.trim() !== "") fotosArray.push({ url });
    }

    const glossarioItems = document.querySelectorAll('#glossario-container .glossario-item');
    const glossary = Array.from(glossarioItems).map(item => ({
      term: item.querySelector('input[name="termoGlossario"]').value.trim(),
      description: item.querySelector('textarea[name="definicaoGlossario"]').value.trim()
    })).filter(g => g.term && g.description);

    const data = {
      nomePopular: form.nomePopular.value,
      nomeCientifico: form.nomeCientifico.value,
      taxonomia: {
        reino: form.reino?.value || "",
        filo: form.filo?.value || "",
        classe: form.classe?.value || "",
        ordem: form.ordem.value || "",
        familia: form.familia.value || "",
        genero: form.genero?.value || "",
        especie: form.especie?.value || ""
      },
      fotos: fotosArray,
      descricao: form.descricao.value,
      duplicates: form.duplicatas.value || "",
      colectNumber: form.numeroColeta.value ? Number(form.numeroColeta.value) : null,
      colectDate: form.dataColeta.value ? new Date(form.dataColeta.value).toISOString() : null,
      local: form.localidade.value || "",
      collectors: [form.coletor.value || ""],
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
      for (let i = 1; i <= 6; i++) {
        form[`foto${i}`].value = planta.fotos[i]?.url || "";
      }
    }

    form.descricao.value = planta.descricao || "";
    form.duplicatas.value = planta.duplicates || "";
    form.numeroColeta.value = planta.colectNumber || "";
    form.dataColeta.value = planta.colectDate ? new Date(planta.colectDate).toISOString().split("T")[0] : "";
    form.localidade.value = planta.local || "";
    form.coletor.value = planta.collectors?.[0] || "";

    const glossarioContainer = document.getElementById('glossario-container');
    glossarioContainer.innerHTML = "";
    if (planta.glossary && planta.glossary.length) {
      planta.glossary.forEach(item => {
        const glossarioItem = criarGlossarioItem(item.term, item.description);
        glossarioContainer.appendChild(glossarioItem);
      });
    } else {
      glossarioContainer.appendChild(criarGlossarioItem());
    }
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
