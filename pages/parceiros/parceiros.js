const API_URL = "https://herbario-back.onrender.com/api/parceiros";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Erro ao buscar parceiros");

    const parceiros = await res.json();
    const container = document.getElementById("parceiros-container");

    container.innerHTML = ""; // limpa container antes de preencher

    parceiros.forEach(p => {
      const parceiroHTML = `
        <section class="parceiros-box">
          <h2 class="xilosa h3">${p.nome}</h2>

          <div class="retrato">
            <img src="${p.urlMapa}" alt="posição no google maps da cidade de ${p.nome}">
            <legend>${p.descricaoMapa}</legend>
          </div>

          <div class="img-box">
            <div class="principal">
              <img src="${p.imagem1}" alt="Imagem principal de ${p.nome}">
            </div>
            <legend>${p.descricao1}</legend>
          </div>

          <div class="img-box">
            <div class="second">
              <img src="${p.imagem2}" alt="Imagem 2 de ${p.nome}" id="img-1">
              <img src="${p.imagem3}" alt="Imagem 3 de ${p.nome}" id="img-2">
            </div>
            <legend>${p.descricao2}</legend>
          </div>
        </section>
      `;
      container.innerHTML += parceiroHTML;
    });

  } catch (err) {
    console.error(err);
    alert("Erro ao carregar parceiros.");
  }
});
