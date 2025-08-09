const API_URL = "https://herbario-back.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("planta-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nomePopular: form.nomePopular.value,
      nomeCientifico: form.nomeCientifico.value,
      taxonomia: {
        reino: "form.reino.value",
        filo: "form.filo.value",
        classe: form.classe.value,
        ordem: form.ordem.value,
        familia: form.familia.value,
        genero: "form.genero.value",
        especie: "form.especie.value"
      },
      fotos: [{
          url: form.imagemCapa.value,
          local: "form.local.value",
          data: "form.data.value"
        },
        {
          url: form.galeria1.value,
          local: "form.local2.value",
          data: "form.data2.value"
        },
        {
          url: form.galeria2.value,
          local: "form.local3.value",
          data: "form.data3.value"
        },
        {
          url: form.galeria3.value,
          local: "form.local4.value",
          data: "form.data4.value"
        },
        {
          url: form.galeria4.value,
          local: "form.local5.value",
          data: "form.data5.value"
        },
        {
          url: form.galeria5.value,
          local: "form.local6.value",
          data: "form.data6.value"
        },
        {
          url: form.galeria6.value,
          local: "form.local7.value",
          data: "form.data7.value"
        }
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
      const response = await fetch(`${API_URL}/api/plants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Erro ao salvar planta.");

      alert("Planta salva com sucesso!");
      form.reset();
    } catch (error) {
      alert("Erro ao enviar dados: " + error.message);
      console.error(error);
    }
  });
});