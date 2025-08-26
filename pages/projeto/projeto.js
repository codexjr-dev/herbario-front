const API_URL = "https://herbario-back.onrender.com/api/projetos";
const PROJETO_ID = "68969647e3c7ad8d3606a8e4";

document.addEventListener("DOMContentLoaded", async () => {
  await carregarProjeto();
});

async function carregarProjeto() {
  try {
    // Primeiro tenta busca direta por ID
    let resposta = await fetch(`${API_URL}/${PROJETO_ID}`);
    let projeto;
    
    if (resposta.ok) {
      // Se achou diretamente, usa
      projeto = await resposta.json();
    } else {
      // Se não achou, busca todos e filtra
      resposta = await fetch(API_URL);
      if (!resposta.ok) {
        throw new Error(`Erro na API: ${resposta.status}`);
      }
      
      const projetos = await resposta.json();
      projeto = projetos.find(p => p._id === PROJETO_ID);
      
      if (!projeto && projetos.length > 0) {
        // Se não achou o específico, usa o primeiro
        projeto = projetos[0];
      }
    }

    if (projeto) {
      atualizarConteudo(projeto);
    } else {
      throw new Error("Nenhum projeto disponível");
    }
    
  } catch (erro) {
    console.error("Erro ao carregar projeto:", erro);
    exibirErro();
  }
}

function atualizarConteudo(projeto) {
  // Atualiza título
  const tituloElement = document.getElementById("titulo-projeto");
  tituloElement.textContent = "Projeto";
  
  // Mantém título da página
  document.title = "Projeto";

  // Atualiza texto principal
  const textoElement = document.getElementById("texto-projeto");
  textoElement.innerHTML = projeto.descricaoProjeto || "Descrição não disponível.";

  // Atualiza imagem se disponível
  if (projeto.imagem && projeto.imagem.trim() !== "") {
    const secaoImagem = document.getElementById("secao-imagem");
    const imagemElement = document.getElementById("imagem-projeto");
    const legendaElement = document.getElementById("legenda-projeto");
    
    imagemElement.src = projeto.imagem;
    imagemElement.alt = "Imagem do projeto";
    legendaElement.textContent = projeto.descricaoImagem || "";
    
    secaoImagem.style.display = "block";
  }
}

function exibirErro() {
  document.getElementById("titulo-projeto").textContent = "Projeto";
  document.getElementById("texto-projeto").innerHTML = 
    "Desculpe, não foi possível carregar as informações do projeto no momento. Tente novamente mais tarde.";
  
  document.getElementById("secao-imagem").style.display = "none";
}