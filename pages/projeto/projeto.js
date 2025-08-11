const API_URL = "https://herbario-back.onrender.com/api/projetos";

 //Serve pra garantir que só possa entrar se tiver logado
 const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/pages/login/login-admin.html';
}

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