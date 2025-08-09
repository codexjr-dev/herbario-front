const API_URL = "https://herbario-back.onrender.com/api/login"; // rota real

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.querySelector("#usuario").value;
  const senha = document.querySelector("#senha").value;

  // Monta as credenciais no formato Basic Auth
  const credentials = btoa(`${usuario}:${senha}`);

  try {
    const resposta = await fetch(API_URL, {
      method: "GET", // ou "POST" se o backend tiver definido assim
      headers: {
        "Authorization": `Basic ${credentials}`
      }
    });

    if (resposta.ok) {
      const dados = await resposta.json().catch(() => null);
      console.log("Resposta do servidor:", dados || "Login bem-sucedido");
      localStorage.setItem("authToken", credentials);
      window.location.href = "painel-admin.html";
    } else {
      alert("Usuário ou senha inválidos.");
    }
  } catch (erro) {
    console.error("Erro ao fazer login:", erro);
    alert("Erro ao conectar com o servidor.");
  }
});
