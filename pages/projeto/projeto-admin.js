const API_URL = "https://herbario-back.onrender.com/api/projetos";
const FIXED_ID = "68969647e3c7ad8d3606a8e4";

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

  // Buscar todos e filtrar pelo ID fixo
  fetch(API_URL, { headers: AUTH_HEADERS })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar projetos");
      return res.json();
    })
    .then(projetos => {
      const projeto = projetos.find(p => p._id === FIXED_ID);

      if (!projeto) {
        alert("Projeto com ID fixo não encontrado no banco!");
        return;
      }

      // Preenche os campos
      form.descricao.value = projeto.descricaoProjeto || "";
      form["imagem-url"].value = projeto.imagem || "";
      form["imagem-descricao"].value = projeto.descricaoImagem || "";

      console.log("Projeto carregado:", projeto);
    })
    .catch(err => {
      console.error("Erro ao carregar projeto:", err);
    });

  // Salvar edição
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const projetoData = {
      descricaoProjeto: form.descricao.value.trim(),
      imagem: form["imagem-url"].value.trim(),
      descricaoImagem: form["imagem-descricao"].value.trim(),
    };

    fetch(`${API_URL}/${FIXED_ID}`, {
      method: "PUT",
      headers: AUTH_HEADERS,
      body: JSON.stringify(projetoData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Falha ao salvar projeto");
        return res.json();
      })
      .then(saved => {
        alert("Edição realizada!");
        console.log("Projeto atualizado:", saved);
      })
      .catch(err => {
        console.error("Erro ao salvar projeto:", err);
        alert("Erro ao salvar projeto.");
      });
  });
});
