const API_URL = "https://herbario-back.onrender.com";

async function carregarPlantas() {
  const credentials = localStorage.getItem("authToken");
  if (!credentials) {
    alert("Usuário não autenticado. Faça login.");
    window.location.href = "login.html";
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/api/plants`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`
      }
    });

    if (!resposta.ok) {
      throw new Error("Erro ao buscar plantas");
    }

    const plantas = await resposta.json();
    const corpoTabela = document.getElementById("plantas-table-body");
    corpoTabela.innerHTML = "";

    plantas.forEach(planta => {
      const linha = document.createElement("tr");

      const tdNome = document.createElement("td");
      tdNome.textContent = planta.nomePopular;

      const tdAcoes = document.createElement("td");
      tdAcoes.classList.add("botoes");

      const botaoEditar = document.createElement("a");
      botaoEditar.href = `plantas-admin.html?id=${planta._id}`;
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
  const confirmar = confirm("Tem certeza que deseja excluir esta planta?");
  if (!confirmar) return;

  const credentials = localStorage.getItem("authToken");
  if (!credentials) {
    alert("Usuário não autenticado. Faça login.");
    window.location.href = "login.html";
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/api/plants/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`
      }
    });

    if (!resposta.ok) {
      throw new Error("Erro ao excluir planta");
    }

    alert("Planta excluída com sucesso!");
    carregarPlantas();
  } catch (erro) {
    console.error(erro);
    alert("Erro ao excluir planta.");
  }
}

window.addEventListener("DOMContentLoaded", carregarPlantas);
