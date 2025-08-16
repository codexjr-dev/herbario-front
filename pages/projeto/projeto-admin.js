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

  let projetoId = null; // será preenchido se já existir projeto

  // Carregar projeto existente (se houver)
  fetch(API_URL, { headers: AUTH_HEADERS })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar projeto");
      return res.json();
    })
    .then(projetos => {
      if (projetos.length > 0) {
        const projeto = projetos[0]; // sempre pega o único projeto
        projetoId = projeto.id;

        form.descricao.value = projeto.descricaoProjeto || "";
        form["imagem-url"].value = projeto.imagem || "";
        form["imagem-descricao"].value = projeto.descricaoImagem || "";
     
        console.log("Projeto carregado do banco:", projeto);
      }
    })
    .catch(err => {
      console.error("Erro ao carregar projeto:", err);
    });

  // Salvar (novo ou edição)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const projetoData = {
      descricaoProjeto: form.descricao.value.trim(),
      imagem: form["imagem-url"].value.trim(),
      descricaoImagem: form["imagem-descricao"].value.trim(),
    };

    const method = projetoId ? "PUT" : "POST";
     const url = projetoId ? `${API_URL}/${projetoId}` : API_URL; // usa id se já existe

    fetch(url, {
      method,
      headers: AUTH_HEADERS,
      body: JSON.stringify(projetoData)
    })
    .then(res => {
      if (!res.ok) throw new Error("Falha ao salvar projeto");
      return res.json();
    })
    .then(saved => {
      projetoExiste = true; // garante que ID fica salvo para edições futuras
      alert("Projeto salvo com sucesso!");
      console.log("Projeto salvo:", saved);
    })
    .catch(err => {
      console.error("Erro ao salvar projeto:", err);
      alert("Erro ao salvar projeto.");
    });
  });
});
