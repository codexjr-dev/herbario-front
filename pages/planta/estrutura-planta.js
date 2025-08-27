const API_URL = "https://herbario-back.onrender.com/api/plants";
const IMAGEM_PADRAO = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpttnfhDbmXTkbWTyJU_fotk6nrElsiG2Vng&s";// imagem padrão

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const plantaId = urlParams.get("id");
  if (!plantaId) return alert("ID da planta não encontrado.");

  try {
    const token = localStorage.getItem("token"); // opcional
    const res = await fetch(`${API_URL}/${plantaId}`, {
      headers: { "Authorization": `Basic ${token || ""}` }
    });
    if (!res.ok) throw new Error("Erro ao buscar planta");

    const planta = await res.json();

    // Função auxiliar para preencher textos
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value || "—";
    };

    setText("nomePopular", planta.nomePopular);
    setText("descricao", planta.descricao);
    setText("nomeCientifico", planta.nomeCientifico);
    setText("colectNumber", planta.colectNumber);
    setText("classe", planta.taxonomia?.classe);
    setText("colectDate", planta.colectDate ? new Date(planta.colectDate).toLocaleDateString() : "");
    setText("ordem", planta.taxonomia?.ordem);
    setText("localidade", planta.local);
    setText("familia", planta.taxonomia?.familia);
    setText("coletor", planta.collectors?.join(", "));
    setText("especieTipo", planta.taxonomia?.especie);
    setText("duplicates", planta.duplicates);

    // Imagem de capa
    const capa = document.getElementById("capaPlanta");
    capa.src = (planta.fotos && planta.fotos[0]?.url) ? planta.fotos[0].url : IMAGEM_PADRAO;

    // Galeria 6 fotos
   for (let i = 1; i <= 6; i++) {
    const img = document.getElementById(`foto${i}`);
    img.src = (planta.fotos[i]?.url) ? planta.fotos[i].url : IMAGEM_PADRAO;
    img.alt = planta.nomePopular || "Imagem da planta";
  }

  // Glossário
  const glossarioContainer = document.getElementById("glossario-container");
  glossarioContainer.innerHTML = "";

  if (planta.glossary && planta.glossary.length > 0) {
    planta.glossary.forEach(item => {
      const p = document.createElement("p");
      p.innerHTML = `<strong class="termo-glossario">${item.term}:</strong> ${item.description}`;
      glossarioContainer.appendChild(p);
    });
  }


  } catch (err) {
    console.error(err);
    alert("Erro ao carregar planta.");
  }
});
