  document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede o envio tradicional

    const usuario = document.querySelector("#usuario").value;
    const senha = document.querySelector("#senha").value;

    try {
      const resposta = await fetch("http://localhost:3000/login-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario, senha })
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        // Aqui você pode salvar o token/localStorage se usar autenticação
        window.location.href = "painel-admin.html";
      } else {
        alert("Usuário ou senha inválidos.");
      }
    } catch (erro) {
      console.error("Erro ao fazer login:", erro);
      alert("Erro ao conectar com o servidor.");
    }
  });

