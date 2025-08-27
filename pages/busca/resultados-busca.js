const API_URL = "https://herbario-back.onrender.com/api/plants";

// Função para normalizar string: minúscula + remove acentos
function normalize(str) {
  return str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
}

async function carregarResultados() {
  const params = new URLSearchParams(window.location.search);

  // pega os parâmetros da URL e normaliza TODOS
  const termo = normalize(params.get("busca"));
  const classe = normalize(params.get("classe"));   // ← CORRIGIDO: normalizar
  const familia = normalize(params.get("familia")); // ← CORRIGIDO: normalizar

  try {
    const resposta = await fetch(API_URL);
    const plantas = await resposta.json();

    // filtra os dados no front-end
    const plantasFiltradas = plantas.filter(planta => {
      const nomePopular = normalize(planta.nomePopular);
      const nomeCientifico = normalize(planta.nomeCientifico);
      // CORRIGIDO: Acessar classe e família dentro de taxonomia
      const plantaClasse = normalize(planta.taxonomia?.classe);
      const plantaFamilia = normalize(planta.taxonomia?.familia);

      // Busca por termo (funciona com includes)
      const termoValido = !termo || nomePopular.includes(termo) || nomeCientifico.includes(termo);
      
      // ALTERNATIVA: Usar === para busca exata (descomente se preferir)
      // const classeValida = !classe || plantaClasse === classe;
      // const familiaValida = !familia || plantaFamilia === familia;
      
      // RECOMENDADO: Usar includes() para busca mais flexível
      const classeValida = !classe || plantaClasse.includes(classe);
      const familiaValida = !familia || plantaFamilia.includes(familia);

      return termoValido && classeValida && familiaValida;
    });

    // Ordena alfabeticamente pelo nome popular
    plantasFiltradas.sort((a, b) => normalize(a.nomePopular).localeCompare(normalize(b.nomePopular)));

    const lista = document.querySelector("main ul");
    lista.innerHTML = "";

    if (!plantasFiltradas.length) {
      lista.innerHTML = "<li>Nenhuma planta encontrada.</li>";
      document.querySelector("legend .bold").textContent = "0";
      return;
    }

    // renderiza os resultados
    plantasFiltradas.forEach(planta => {
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
    document.querySelector("legend .bold").textContent = plantasFiltradas.length;
  } catch (error) {
    console.error("Erro ao buscar plantas:", error);
  }
}

// Função para debug - adicione temporariamente para verificar os dados
async function debugFiltros() {
  const params = new URLSearchParams(window.location.search);
  console.log("Parâmetros da URL:", {
    busca: params.get("busca"),
    classe: params.get("classe"),
    familia: params.get("familia")
  });
  
  // Debug da estrutura dos dados da API
  try {
    const resposta = await fetch(API_URL);
    const plantas = await resposta.json();
    console.log("Exemplo de planta (estrutura):", plantas[0]);
    console.log("Taxonomia da primeira planta:", plantas[0]?.taxonomia);
  } catch (error) {
    console.error("Erro no debug:", error);
  }
}

carregarResultados();
// debugFiltros(); // Descomente para ver os parâmetros no console