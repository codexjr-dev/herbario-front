const API_URL = "https://herbario-back.onrender.com/api/plants";

async function carregarResultados() {
  const params = new URLSearchParams(window.location.search);

  // monta a URL do backend
  const url = new URL(API_URL);
  if (params.get("nome")) url.searchParams.append("nome", params.get("nome"));
  if (params.get("classe")) url.searchParams.append("classe", params.get("classe"));
  if (params.get("familia")) url.searchParams.append("familia", params.get("familia"));

  try {
    const resposta = await fetch(url);
    const plantas = await resposta.json();

    const lista = document.querySelector("main ul");
    lista.innerHTML = "";

    if (!plantas.length) {
      lista.innerHTML = "<li>Nenhuma planta encontrada.</li>";
      document.querySelector("legend .bold").textContent = "0";
      return;
    }

    plantas.forEach(planta => {
      const link = document.createElement("a");
      link.href = `../planta/estrutura-planta.html?id=${planta._id}`;
      link.innerHTML = `
        <li>
          <img src="${planta.fotos?.[0]?.url || '../../assets/default.png'}" alt="${planta.nomePopular}">

          <section>
            <span class="nome-planta">${planta.nomePopular}</span>
            <p>${planta.descricao || "Sem descrição disponível."}</p>
          </section>
        </li>
      `;
      lista.appendChild(link);
    });

    // atualiza contador
    document.querySelector("legend .bold").textContent = plantas.length;
  } catch (error) {
    console.error("Erro ao buscar plantas:", error);
  }
}

carregarResultados();
