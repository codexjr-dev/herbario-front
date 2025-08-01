
const API_URL = process.env.PORT;
require("dotenv").config();

const AUTH_HEADERS = {
  "Authorization": "Basic YWRtaW46YWRtaW4xMjM=",
  "Content-Type": "application/json"
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("planta-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nomePopular: form.nomePopular.value,
      nomeCientifico: form.nomeCientifico.value,
      familia: form.familia.value,
      descricao: form.descricao.value,
      imagemCapa: form.imagemCapa.value,

      especieTipo: form.especieTipo.value,
      ordem: form.ordem.value,
      duplicatas: form.duplicatas.value,
      numeroColeta: form.numeroColeta.value,
      dataColeta: form.dataColeta.value,
      localidade: form.localidade.value,
      coletor: form.coletor.value,
      observacoes: form.observacoes.value,

      glossario: {
        termo: form.termoGlossario.value,
        definicao: form.definicaoGlossario.value,
      },

      galeria: [
        form.galeria1.value,
        form.galeria2.value,
        form.galeria3.value,
        form.galeria4.value,
        form.galeria5.value,
        form.galeria6.value,
      ].filter(url => url.trim() !== "")
    };

    try {
      const response = await fetch(`${API_URL}/plantas`, {
        method: "POST",
        headers: AUTH_HEADERS,
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