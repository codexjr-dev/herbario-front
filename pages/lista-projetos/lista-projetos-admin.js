const API_URL = "https://herbario-back.onrender.com/api/projetos";
const token = localStorage.getItem('token');

if (!token) {
  alert("Usuário não autenticado. Faça login.");
  window.location.href = '/pages/login/login-admin.html';
}

async function carregarProjetos() {
  try {
    const resposta = await fetch(API_URL, {
      headers: { "Authorization": `Basic ${token}` }
    });
    if (!resposta.ok) throw new Error("Erro ao buscar projetos");

    const projetos = await resposta.json();
    const corpoTabela = document.getElementById("projetos-table-body");
    corpoTabela.innerHTML = "";

    projetos.forEach(projeto => {
      const linha = document.createElement("tr");

      const tdDescricao = document.createElement("td");
      tdDescricao.textContent = projeto.descricaoProjeto || "—";

      const tdImagem = document.createElement("td");
      if (projeto.imagem) {
        const img = document.createElement("img");
        img.src = projeto.imagem;
        img.alt = "Imagem do projeto";
        tdImagem.appendChild(img);
      }

      const tdAcoes = document.createElement("td");
      tdAcoes.classList.add("botoes");

      const botaoEditar = document.createElement("a");
      botaoEditar.href = `/pages/projeto/projeto-admin.html?id=${projeto._id}`;
      botaoEditar.textContent = "Editar";
      botaoEditar.className = "button-editar";

      const botaoExcluir = document.createElement("button");
      botaoExcluir.textContent = "Excluir";
      botaoExcluir.className = "button-excluir";
      botaoExcluir.onclick = () => excluirProjeto(projeto._id);

      tdAcoes.appendChild(botaoEditar);
      tdAcoes.appendChild(botaoExcluir);

      linha.appendChild(tdDescricao);
      linha.appendChild(tdImagem);
      linha.appendChild(tdAcoes);
      corpoTabela.appendChild(linha);
    });

  } catch (erro) {
    console.error(erro);
    alert("Erro ao carregar projetos.");
  }
}

async function excluirProjeto(id) {
  if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Basic ${token}` }
    });
    if (!resposta.ok) throw new Error("Erro ao excluir projeto");

    alert("Projeto excluído com sucesso!");
    carregarProjetos();
  } catch (erro) {
    console.error(erro);
    alert("Erro ao excluir projeto.");
  }
}

window.addEventListener("DOMContentLoaded", carregarProjetos);
