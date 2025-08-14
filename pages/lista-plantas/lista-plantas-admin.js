const API_URL = "https://herbario-back.onrender.com/api/plants";

const token = localStorage.getItem('token');
if (!token) {
  alert("Usuário não autenticado. Faça login.");
  window.location.href = '/pages/login/login-admin.html';
}

async function carregarPlantas() {
  try {
    const resposta = await fetch(API_URL, {
      headers: { "Authorization": `Basic ${token}` }
    });
    if (!resposta.ok) throw new Error("Erro ao buscar plantas");

    const plantas = await resposta.json();
    const corpoTabela = document.getElementById("plantas-table-body");
    corpoTabela.innerHTML = "";

    plantas.forEach(planta => {
      const linha = document.createElement("tr");

      const tdNome = document.createElement("td");
      tdNome.textContent = planta.nomePopular || "—";

      const tdAcoes = document.createElement("td");
      tdAcoes.classList.add("botoes");

      const botaoEditar = document.createElement("a");
      botaoEditar.href = `/pages/plantas/plantas-admin.html?id=${planta._id}`;
      botaoEditar.textContent = "Editar";
      botaoEditar.className = "button-editar";

      const botaoExcluir = document.createElement("button");
      botaoExcluir.textContent = "Excluir";
      botaoExcluir.className = "button-excluir";
      botaoExcluir.onclick = () => excluirPlanta(planta._id);

      tdAcoes.appendChild(botaoEditar);
      tdAcoes.appendChild(botaoExcluir);

      linha.appendChild(tdNome);
      linha.appendChild(tdAcoes);
      corpoTabela.appendChild(linha);
    });
  } catch (erro) {
    console.error(erro);
    alert("Erro ao carregar plantas.");
  }
}

async function excluirPlanta(id) {
  if (!confirm("Tem certeza que deseja excluir esta planta?")) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Basic ${token}` }
    });
    if (!resposta.ok) throw new Error("Erro ao excluir planta");

    alert("Planta excluída com sucesso!");
    carregarPlantas();
  } catch (erro) {
    console.error(erro);
    alert("Erro ao excluir planta.");
  }
}

window.addEventListener("DOMContentLoaded", carregarPlantas);
