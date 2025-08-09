const API_URL = "https://herbario-back.onrender.com"; 

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.querySelector("#usuario").value;
  const senha = document.querySelector("#senha").value;

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha })
    });

    if (resposta.ok) {
      const dados = await resposta.json();
      const token = dados.token; // ajusta conforme o formato que sua API retorna o token
      if (!token) {
        alert("Token não recebido. Verifique a API.");
        return;
      }
      localStorage.setItem("authToken", token);
      window.location.href = "painel-admin.html"; // redireciona para o painel
    } else {
      alert("Usuário ou senha inválidos.");
    }
  } catch (erro) {
    console.error("Erro ao fazer login:", erro);
    alert("Erro ao conectar com o servidor.");
  }
});


