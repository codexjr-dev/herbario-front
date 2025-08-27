document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const termo = document.getElementById("busca1").value.trim();
  const classe = document.querySelector("select[name='classe']").value;
  const familia = document.querySelector("select[name='familia']").value;

  const params = new URLSearchParams();
  if (termo) params.append("busca", termo);  // envia como 'busca'
  if (classe) params.append("classe", classe);
  if (familia) params.append("familia", familia);

  window.location.href = `pages/busca/resultados-busca.html?${params.toString()}`;
});
