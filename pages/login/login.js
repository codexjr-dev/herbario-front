const API_URL = "https://herbario-back.onrender.com/api/login"; // rota real

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.querySelector("#usuario").value.trim();
  const senha = document.querySelector("#senha").value.trim();

  const credentials = btoa(`${usuario}:${senha}`);

  try {
    const resposta = await fetch(API_URL, {
      method: "POST", // precisa ser POST
      headers: {
        "Authorization": `Basic ${credentials}`
      }
    });

    if (resposta.ok) {
      const dados = await resposta.json().catch(() => null);
      console.log("Resposta do servidor:", dados || "Login bem-sucedido");

      // Salva token para usar em requisições futuras
      localStorage.setItem('token', credentials);

      // Redireciona para painel
      window.location.href = "/pages/painel-admin/painel-admin.html";
    } else {
      const erroMsg = await resposta.text();
      console.error("Erro:", erroMsg);
      alert("Usuário ou senha inválidos.");
    }
  } catch (erro) {
    console.error("Erro ao fazer login:", erro);
    alert("Erro ao conectar com o servidor.");
  }
});
