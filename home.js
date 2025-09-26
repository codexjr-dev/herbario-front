document.querySelector("form").addEventListener("submit", function(event) {
  event.preventDefault();

  const busca = document.querySelector("#busca1").value.trim();
  const classe = document.querySelector("select[name='classe']").value;
  const familia = document.querySelector("select[name='familia']").value;

  // Monta query string apenas com valores preenchidos
  const params = new URLSearchParams();
  if (busca) params.append("busca", busca);
  if (classe) params.append("classe", classe);
  if (familia) params.append("familia", familia);

  // Redireciona para página de resultados
  window.location.href = `pages/busca/resultados-busca.html?${params.toString()}`;
});
