const API_URL = process.env.PORT;
require("dotenv").config();

document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("parceiro-form");
if (!form) return;

const API_URL = "http://localhost:3000/api/parceiros";
const AUTH_HEADERS = {
  "Authorization": "Basic YWRtaW46YWRtaW4xMjM=",
  "Content-Type": "application/json"
};

const editarId = new URLSearchParams(window.location.search).get("editar");

// Modo edição: buscar dados e preencher formulário
if (editarId) {
  fetch(`${API_URL}/${editarId}`, {
    method: "GET",
    headers: AUTH_HEADERS
  })
    .then(res => res.json())
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
      alert("Erro ao carregar parceiro.");
    });
}

// Submissão do formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const parceiroData = {
    nome: form.nome.value.trim(),
    mapaUrl: form["mapa-url"].value.trim(),
    mapaDescricao: form["mapa-descricao"].value.trim(),
    imagem1Url: form["imagem1-url"].value.trim(),
    imagem1Descricao: form["imagem1-descricao"].value.trim(),
    imagem2Url: form["imagem2-url"].value.trim(),
    imagem3Url: form["imagem3-url"].value.trim(),
    imagem2e3Descricao: form["imagem2e3-descricao"].value.trim(),
  };

  const method = editarId ? "PUT" : "POST";
  const url = editarId ? `${API_URL}/${editarId}` : API_URL;

  fetch(url, {
    method,
    headers: AUTH_HEADERS,
    body: JSON.stringify(parceiroData)
  })
    .then(res => {
      if (!res.ok) throw new Error("Falha ao salvar parceiro");
      alert("Parceiro salvo com sucesso!");
      window.location.href = "lista-parceiros-admin.html";
    })
    .catch(err => {
      console.error("Erro ao salvar parceiro:", err);
      alert("Erro ao salvar parceiro.");
    });
});
});
