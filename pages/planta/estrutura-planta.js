

fetch(`${API_URL}/${editarId}`, {
    method: "GET",
    headers: AUTH_HEADERS
  })
    .then(res => res.json())
    .then((resultado) => {
    document.querySelector("nomePlanta#nomePopular").value = resultado.nomePopular;
    document.querySelector("").value = resultado.nomeCientifico;
    document.querySelector("span#descricao").value = resultado.descricao;
    document.querySelector("h1 xilosa h2").value = resultado.nomePopular;
    document.querySelector("h1 xilosa h2").value = resultado.nomePopular;
    document.querySelector("h1 xilosa h2").value = resultado.nomePopular;
    document.querySelector("h1 xilosa h2").value = resultado.nomePopular;
    document.querySelector("h1 xilosa h2").value = resultado.nomePopular;
    document.querySelector("h1 xilosa h2").value = resultado;
    document.querySelector("h1 xilosa h2").value = resultado;

    // document.querySelector("h1 xilosa h2").value = resultado.nomePopular;








    //   form.nome.value = parceiro.nome || "";
    //   form["mapa-url"].value = parceiro.mapaUrl || "";
    //   form["mapa-descricao"].value = parceiro.mapaDescricao || "";
    //   form["imagem1-url"].value = parceiro.imagem1Url || "";
    //   form["imagem1-descricao"].value = parceiro.imagem1Descricao || "";
    //   form["imagem2-url"].value = parceiro.imagem2Url || "";
    //   form["imagem3-url"].value = parceiro.imagem3Url || "";
    //   form["imagem2e3-descricao"].value = parceiro.imagem2e3Descricao || "";
    })
    .catch(err => {
      console.error("Erro ao carregar parceiro para edição:", err);
      alert("Erro ao carregar parceiro.");
    });