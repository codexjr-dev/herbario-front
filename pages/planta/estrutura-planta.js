const API_URL = "https://herbario-back.onrender.com/api/plants";

//Serve pra garantir que só possa entrar se tiver logado
const token = localStorage.getItem('token');
if (!token) {
  alert('Faça login para editar plantas.');
  window.location.href = '/pages/login/login-admin.html';
}


// Função para pegar o parâmetro `id` da URL
function getEditarId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

const editarId = getEditarId();

if (editarId) {
  fetch(`${API_URL}/${editarId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao carregar planta");
      return res.json();
    })
    .then(planta => {
      // Preencher campos do formulário
      document.querySelector("#nomePopular").value = planta.nomePopular || "";
      document.querySelector("#nomeCientifico").value = planta.nomeCientifico || "";
      document.querySelector("#descricao").value = planta.descricao || "";
      
      // Exemplo para taxonomia
      document.querySelector("#reino").value = planta.taxonomia?.reino || "";
      document.querySelector("#filo").value = planta.taxonomia?.filo || "";
      document.querySelector("#classe").value = planta.taxonomia?.classe || "";
      document.querySelector("#ordem").value = planta.taxonomia?.ordem || "";
      document.querySelector("#familia").value = planta.taxonomia?.familia || "";
      document.querySelector("#genero").value = planta.taxonomia?.genero || "";
      document.querySelector("#especie").value = planta.taxonomia?.especie || "";

      // E assim por diante para fotos, usos, glossary etc.

      // Preencher a galeria e outros campos conforme estrutura do formulário
    })
    .catch(err => {
      console.error("Erro ao carregar planta para edição:", err);
      alert("Erro ao carregar planta.");
    });
} else {
  alert("ID da planta não fornecido para edição.");
}




