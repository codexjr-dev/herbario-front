const API_URL = "https://herbario-back.onrender.com/api/parceiros";
const imagemPadrao = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpttnfhDbmXTkbWTyJU_fotk6nrElsiG2Vng&s";


// Verifica login
const token = localStorage.getItem('token');
if (!token) {
  alert("Usuário não autenticado. Faça login.");
  window.location.href = '/pages/login/login-admin.html';
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("parceiro-form");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa fazer login novamente.");
    window.location.href = '/pages/login/login-admin.html';
    return;
  }

  // Pega o ID do parceiro da query string (?id=...)
  const parceiroId = new URLSearchParams(window.location.search).get("id");

  // Se houver ID, carrega os dados para edição
  if (parceiroId) {
    carregarParceiroParaEdicao(parceiroId, token);
  }

  // Submit do formulário
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const parceiroData = {
      nome: form.nome.value.trim(),
      urlMapa: form["mapa-url"].value.trim() || imagemPadrao,
      descricaoMapa: form["mapa-descricao"].value.trim() || '',
      imagem1: form["imagem1-url"].value.trim() || imagemPadrao,
      descricao1: form["imagem1-descricao"].value.trim() || '',
      imagem2: form["imagem2-url"].value.trim() || imagemPadrao,
      imagem3: form["imagem3-url"].value.trim() || imagemPadrao,

      descricao2: form["imagem2e3-descricao"].value.trim()
    };

    try {
      const url = parceiroId
        ? `https://herbario-back.onrender.com/api/parceiros/${parceiroId}` // edição
        : `https://herbario-back.onrender.com/api/parceiros`;             // novo cadastro

      const method = parceiroId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Basic ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parceiroData)
      });

      if (!res.ok) throw new Error("Erro ao salvar parceiro");

      alert(parceiroId ? "Edição realizada!" : "Parceiro cadastrado!");

      // Redireciona para lista de parceiros
      window.location.href = "/pages/lista-parceiros/lista-parceiros-admin.html";
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar parceiro.");
    }
  });
});

// Função para carregar parceiro para edição
async function carregarParceiroParaEdicao(id, token) {
  try {
    const res = await fetch("https://herbario-back.onrender.com/api/parceiros", {
      headers: { "Authorization": `Basic ${token}` }
    });
    if (!res.ok) throw new Error("Erro ao buscar parceiros");

    const parceiros = await res.json();
    const parceiro = parceiros.find(p => p._id === id);
    if (!parceiro) throw new Error("Parceiro não encontrado");

    // Preenche os campos do form
    document.getElementById("nome").value = parceiro.nome || "";
    document.getElementById("mapa-url").value = parceiro.urlMapa || "";
    document.getElementById("mapa-descricao").value = parceiro.descricaoMapa || "";
    document.getElementById("imagem1-url").value = parceiro.imagem1 || "";
    document.getElementById("imagem1-descricao").value = parceiro.descricao1 || "";
    document.getElementById("imagem2-url").value = parceiro.imagem2 || "";
    document.getElementById("imagem3-url").value = parceiro.imagem3 || "";
    document.getElementById("imagem2e3-descricao").value = parceiro.descricao2 || "";
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar parceiro para edição.");
  }
}
