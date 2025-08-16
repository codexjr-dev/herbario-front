const API_URL = "https://herbario-back.onrender.com/api/parceiros";
const IMAGEM_PADRAO = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Erro ao buscar parceiros");

    const parceiros = await res.json();
    const container = document.getElementById("parceiros-container");

    parceiros.forEach(p => {
      // Monta o bloco HTML para cada parceiro
      const parceiroHTML = `
        <section class="parceiros-box">
          <h2 class="xilosa h3">${p.nome}</h2>

          <div class="retrato">
            <img src="${p.urlMapa}" alt="">
            <legend>${p.descricaoMapa}</legend>
          </div>

          <div class="img-box">
            <div class="principal">
              <img src="${p.imagem1}" alt="">
            </div>
            <legend>${p.descricao1}</legend>
          </div>

          <div class="img-box">
            <div class="second">
              <img src="${p.imagem2}" alt="">
              <img src="${p.imagem3}" alt="">
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
