const API_URL = 1025;

const AUTH_HEADER = {
  'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=',
  'Content-Type': 'application/json'
};

document.querySelector("#projeto").innerHTML = 
async () => {
    try {
        const resposta = await fetch(`${API_URL}/projeto`, {
          method: 'GET',
          headers: AUTH_HEADER,
          body: JSON.stringify(projeto)
        });
      return resposta.body.resultado;
    } catch (erro) {
      alert(erro.stack);
    }
};

// <h1 class="xilosa">
//      Projeto
//    </h1>