document.querySelector("#salvar").addEventListener("click", cadastrar)
document.querySelector("#busca").addEventListener("keyup", buscar)
document.querySelector("#busca-btn").addEventListener("click", buscar)

let despesas = []

window.addEventListener("load", () => {
  despesas = JSON.parse(localStorage.getItem("despesas")) || []
  atualizar()
})

function filtrarDespesas(filtro, busca, despesaSelect) {
  return despesaSelect.filter((despesa) => despesa[filtro]
  .toLowerCase().includes(busca.toLowerCase()))
}

function buscar(e){
  e.preventDefault()
  const busca = document.querySelector("#busca").value
  const filtro = document.getElementById('filtroSelect').value
  const categoria = document.getElementById('filtroSelect2').value
  let despesasFiltradas = []
  if(categoria !== 'todos'){
    despesasFiltradas = despesas.filter((despesa) =>{
      return despesa.categoria.toLowerCase().includes(categoria.toLowerCase())
    })
  }
  const despesaSelect  = categoria !== "todos" ? despesasFiltradas: despesas;
  if(busca.length === 0){
    return filtrar(despesaSelect)
  }
  despesasFiltradas = filtrarDespesas(filtro, busca, despesaSelect)
  filtrar(despesasFiltradas)  
}

function total(despesas){
  const valorTotal = despesas.reduce((acc,obj) => acc + Number(obj.valor), 0).toFixed(2)
  document.querySelector("#total").innerHTML = `Total: R$${valorTotal}`
}

function filtrar(despesas){
  document.querySelector("#despesas").innerHTML = ""
  despesas.forEach((despesa) =>{
    document.querySelector("#despesas").innerHTML += createCard(despesa)})
}

function display(){
  if(despesas.length !== 0){
    document.querySelector("#display").classList.remove("d-none");
    document.querySelector("#total").classList.remove("d-none");
    document.querySelector("#display").classList.add("d-block");
    document.querySelector("#total").classList.add("d-block");
  }else{
    document.querySelector("#display").classList.remove("d-block");
    document.querySelector("#total").classList.remove("d-block");
    document.querySelector("#display").classList.add("d-none");
    document.querySelector("#total").classList.add("d-none");
  }
}

function atualizar(){
  document.querySelector("#despesas").innerHTML = ""
  localStorage.setItem("despesas", JSON.stringify(despesas))
  despesas.forEach((despesa) =>{
    document.querySelector("#despesas").innerHTML += createCard(despesa)
  })
  display()
  total(despesas)
}

function getDate(){
  const dateNow = new Date()
  const d = String(dateNow.getDate()).padStart(2, '0');
  const m = String(dateNow.getMonth() + 1).padStart(2, '0');
  const y = dateNow.getFullYear();
  return d + '/' + m + '/' + y;
}

function cadastrar(){
  const titulo = document.querySelector("#titulo").value
  const valor = Number(document.querySelector("#valor").value).toFixed(2)
  const categoria = document.querySelector("#categoria").value
  const modal = bootstrap.Modal.getInstance(document.querySelector("#exampleModal"))
  const data = getDate()

  const despesa = {
    id: Date.now(),
    data,
    titulo,
    valor,
    categoria,
  }
  
  if (!validar(despesa.titulo, document.querySelector("#titulo"))) return
  if (!validar(despesa.valor, document.querySelector("#valor"))) return
  
  despesas.push(despesa)    
  
  atualizar()
  modal.hide()
}

function validar(valor, campo){
  if(valor == ""){
    campo.classList.add("is-invalid")
    campo.classList.remove("is-valid")
    return false
  }
  campo.classList.remove("is-invalid")
  campo.classList.add("is-valid")
  return true
}

function apagar(id){
  despesas = despesas.filter((despesa) => despesa.id != id);
  atualizar()
}

function createCard(despesa){
  return `<section class="col-lg-3 col-md-6 col-12 mt-3">
              <section class="card">
                  <section class="card-header">
                      ${despesa.titulo}
                  </section>
                  <section class="card-body">
                      <p class="card-test">${despesa.data}</p>
                      <p class="card-text">R$ ${despesa.valor}</p>
                      <p>
                          <span class="badge text-bg-warning">${despesa.categoria}</span>
                      </p>
                      <a onClick="apagar(${despesa.id})" href="#" class="btn btn-danger">
                          <i class="bi bi-trash"></i>
                      </a>
                  </section>
              </section>
          </section>`
}