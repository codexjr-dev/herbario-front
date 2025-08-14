const API_URL = "https://herbario-back.onrender.com/api/plants";

// Garante que só possa entrar se estiver logado
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
    // --- Preencher dados da seção "Dados" ---
    document.getElementById('nomeCientifico').textContent = planta.nomeCientifico || "";
    document.getElementById('numeroColeta').textContent = planta.numeroColeta || "";
    document.getElementById('classe').textContent = planta.classe || "";
    document.getElementById('dataColeta').textContent = planta.dataColeta ? new Date(planta.dataColeta).toLocaleDateString() : "";
    document.getElementById('ordem').textContent = planta.ordem || "";
    document.getElementById('localidade').textContent = planta.localidade || "";
    document.getElementById('familia').textContent = planta.familia || "";
    document.getElementById('coletor').textContent = planta.coletor?.map(c => c.nome).join(', ') || "";
    document.getElementById('especimeTipo').textContent = planta.especimeTipo || "Não informado.";
    document.getElementById('duplicatas').textContent = planta.duplicatas || "Não informado.";

    // --- Preencher glossário ---
    const glossarioContainer = document.getElementById('glossario-container');
    glossarioContainer.innerHTML = ""; // Limpa o container
    if (planta.glossario && planta.glossario.length > 0) {
      planta.glossario.forEach(item => {
        const div = document.createElement('div');
        div.className = "glossario-item";
        div.innerHTML = `
          <label>Termo:</label>
          <span>${item.termo}</span>
          <label>Descrição:</label>
          <span>${item.descricao}</span>
        `;
        glossarioContainer.appendChild(div);
      });
    } else {
      glossarioContainer.innerHTML = "<p>Nenhum termo cadastrado.</p>";
    }

    // --- Preencher fotos ---
    for (let i = 1; i <= 6; i++) {
      const inputFoto = document.getElementById(`galeria${i}`);
      if (planta.fotos && planta.fotos[i - 1]) {
        inputFoto.value = planta.fotos[i - 1].url;
      } else {
        inputFoto.value = "";
      }
    }
  })
  .catch(err => {
    console.error("Erro ao carregar planta para edição:", err);
    alert("Erro ao carregar planta.");
  });
} else {
  alert("ID da planta não fornecido para edição.");
}
