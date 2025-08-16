const API_URL = "https://herbario-back.onrender.com/api/parceiros";

// Verifica login
const token = localStorage.getItem('token');
if (!token) {
  alert("Usuário não autenticado. Faça login.");
  window.location.href = '/pages/login/login-admin.html';
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("parceiro-form");
  if (!form) return;

  const AUTH_HEADERS = {
    "Authorization": `Basic ${token}`,
    "Content-Type": "application/json"
  };

  // Pegamos o id da query param ?id= para edição
  const parceiroId = new URLSearchParams(window.location.search).get("id");

  // Se for edição, carrega os dados
  if (parceiroId) {
    fetch(`${API_URL}/${parceiroId}`, { headers: AUTH_HEADERS })
      .then(res => {
        if (!res.ok) throw new Error("Parceiro não encontrado");
        return res.json();
      })
      .then(parceiro => {
        form.nome.value = parceiro.nome || "";
        form["mapa-url"].value = parceiro.mapaUrl || "";
        form["mapa-descricao"].value = parceiro.mapaDescricao || "";
        form["imagem1-url"].value = parceiro.imagem1Url || "";
        form["imagem1-descricao"].value = parceiro.imagem1Descricao || "";
        form["imagem2-url"].value = parceiro.imagem2Url || "";
        form["imagem3-url"].value = parceiro.imagem3Url || "";
        form["imagem2e3-descricao"].value = parceiro.imagem2e3Descricao || "";
      })
      .catch(err => {
        console.error("Erro ao carregar parceiro para edição:", err);
        alert("Erro ao carregar parceiro para edição.");
      });
  }

  // Salvar (novo ou edição)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const parceiroData = {
      nome: form.nome.value.trim(),
      urlMapa: form["mapa-url"].value.trim(),
      descricaoMapa: form["mapa-descricao"].value.trim(),
      imagem1: form["imagem1-url"].value.trim(),
      descricao1: form["imagem1-descricao"].value.trim(),
      imagem2: form["imagem2-url"].value.trim(),
      imagem3: form["imagem3-url"].value.trim(),
      descricao2: form["imagem2e3-descricao"].value.trim(),
    };

    const method = parceiroId ? "PUT" : "POST";
    const url = parceiroId ? `${API_URL}/${parceiroId}` : API_URL;

    fetch(url, {
      method,
      headers: AUTH_HEADERS,
      body: JSON.stringify(parceiroData)
    })
    .then(res => {
      if (!res.ok) throw new Error("Falha ao salvar parceiro");
      alert("Parceiro salvo com sucesso!");
      window.location.href = "../lista-parceiros/lista-parceiros-admin.html";
    })
    .catch(err => {
      console.error("Erro ao salvar parceiro:", err);
      alert("Erro ao salvar parceiro.");
    });
  });
});
