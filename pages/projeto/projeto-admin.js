const API_URL = "https://herbario-back.onrender.com/api/projetos";

// Verifica login
const token = localStorage.getItem('token');
if (!token) {
  alert("Usuário não autenticado. Faça login.");
  window.location.href = '/pages/login/login-admin.html';
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("projeto-form");
  if (!form) return;

  const AUTH_HEADERS = {
    "Authorization": `Basic ${token}`,
    "Content-Type": "application/json"
  };

  // Pega id de edição na query string (?id=)
  const projetoId = new URLSearchParams(window.location.search).get("id");

  // Se for edição, carrega os dados
  if (projetoId) {
    fetch(`${API_URL}/${projetoId}`, { headers: AUTH_HEADERS })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar projeto");
        return res.json();
      })
      .then(projeto => {
        form.descricao.value = projeto.descricao || "";
        form["imagem-url"].value = projeto.imagem || "";
        form["imagem-descricao"].value = projeto.imagemDescricao || "";
      })
      .catch(err => {
        console.error("Erro ao carregar projeto:", err);
        alert("Erro ao carregar projeto para edição.");
      });
  }

  // Salvar (novo ou edição)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

  const projetoData = {
    descricaoProjeto: form.descricao.value.trim(),
    imagem: form["imagem-url"].value.trim(),
    descricaoImagem: form["imagem-descricao"].value.trim(),
  };


    const method = projetoId ? "PUT" : "POST";
    const url = projetoId ? `${API_URL}/${projetoId}` : API_URL;

    fetch(url, {
      method,
      headers: AUTH_HEADERS,
      body: JSON.stringify(projetoData)
    })
    .then(res => {
      if (!res.ok) throw new Error("Falha ao salvar projeto");
      alert("Projeto salvo com sucesso!");
      window.location.href = "../lista-projetos/lista-projetos-admin.html";
    })
    .catch(err => {
      console.error("Erro ao salvar projeto:", err);
      alert("Erro ao salvar projeto.");
    });
  });
});
