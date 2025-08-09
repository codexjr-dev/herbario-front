const API_URL = "https://herbario-back.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("planta-form");

  // Recupera credenciais do login
  const credentials = localStorage.getItem("authToken");
  if (!credentials) {
    alert("Você precisa fazer login novamente.");
    window.location.href = "login.html";
    return;
  }

  // Verifica se veio ID de planta na URL (modo edição)
  const urlParams = new URLSearchParams(window.location.search);
  const plantaId = urlParams.get("id");

  // Se for edição, busca dados da planta e preenche formulário
  if (plantaId) {
    fetch(`${API_URL}/api/plants/${plantaId}`, {
      method: "GET",
      headers: { "Authorization": `Basic ${credentials}` }
    })
      .then(res => res.json())
      .then(planta => preencherFormulario(planta))
      .catch(err => console.error("Erro ao carregar planta:", err));
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nomePopular: form.nomePopular.value,
      nomeCientifico: form.nomeCientifico.value,
      taxonomia: {
        reino: form.reino.value,
        filo: form.filo.value,
        classe: form.classe.value,
        ordem: form.ordem.value,
        familia: form.familia.value,
        genero: form.genero.value,
        especie: form.especie.value
      },
      fotos: [
        { url: form.imagemCapa.value, local: form.local.value, data: form.data.value },
        { url: form.galeria1.value, local: form.local2.value, data: form.data2.value },
        { url: form.galeria2.value, local: form.local3.value, data: form.data3.value },
        { url: form.galeria3.value, local: form.local4.value, data: form.data4.value },
        { url: form.galeria4.value, local: form.local5.value, data: form.data5.value },
        { url: form.galeria5.value, local: form.local6.value, data: form.data6.value },
        { url: form.galeria6.value, local: form.local7.value, data: form.data7.value }
      ],
      descricao: form.descricao.value,
      usos: [""],
      especieTipo: form.especieTipo.value,
      duplicates: form.duplicatas.value,
      collectNumber: form.numeroColeta.value,
      colectDate: form.dataColeta.value,
      local: form.localidade.value,
      collectors: [form.coletor.value],
      observations: form.observacoes.value,
      glossary: [{
        term: form.termoGlossario.value,
        description: form.definicaoGlossario.value,
      }],
    };

    try {
      const response = await fetch(
        plantaId ? `${API_URL}/api/plants/${plantaId}` : `${API_URL}/api/plants`,
        {
          method: plantaId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${credentials}`
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) throw new Error("Erro ao salvar planta.");

      alert(plantaId ? "Planta atualizada com sucesso!" : "Planta cadastrada com sucesso!");
      window.location.href = "lista-plantas.html";
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
      form.data.value = planta.fotos[0]?.data || "";

      form.galeria1.value = planta.fotos[1]?.url || "";
      form.local2.value = planta.fotos[1]?.local || "";
      form.data2.value = planta.fotos[1]?.data || "";

      form.galeria2.value = planta.fotos[2]?.url || "";
      form.local3.value = planta.fotos[2]?.local || "";
      form.data3.value = planta.fotos[2]?.data || "";

      form.galeria3.value = planta.fotos[3]?.url || "";
      form.local4.value = planta.fotos[3]?.local || "";
      form.data4.value = planta.fotos[3]?.data || "";

      form.galeria4.value = planta.fotos[4]?.url || "";
      form.local5.value = planta.fotos[4]?.local || "";
      form.data5.value = planta.fotos[4]?.data || "";

      form.galeria5.value = planta.fotos[5]?.url || "";
      form.local6.value = planta.fotos[5]?.local || "";
      form.data6.value = planta.fotos[5]?.data || "";

      form.galeria6.value = planta.fotos[6]?.url || "";
      form.local7.value = planta.fotos[6]?.local || "";
      form.data7.value = planta.fotos[6]?.data || "";
    }

    form.descricao.value = planta.descricao || "";
    form.especieTipo.value = planta.especieTipo || "";
    form.duplicatas.value = planta.duplicates || "";
    form.numeroColeta.value = planta.collectNumber || "";
    form.dataColeta.value = planta.colectDate || "";
    form.localidade.value = planta.local || "";
    form.coletor.value = planta.collectors?.[0] || "";
    form.observacoes.value = planta.observations || "";
    form.termoGlossario.value = planta.glossary?.[0]?.term || "";
    form.definicaoGlossario.value = planta.glossary?.[0]?.description || "";
  }
});
