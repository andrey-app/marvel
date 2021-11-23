const quantidadePaginas = document.querySelector(".quantidade-paginas");
const linkSemImagem =  "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
const sectionInicial = document.querySelector(".section__inicial");
const sectionPersonagem = document.querySelector(".section__personagem");
const footer = document.querySelector("footer");
const voltar = document.querySelector("#voltarPagina");
const imagemPersonagem = document.querySelector(".section__personagem--img");
const descriptionDiv = document.querySelector(".section__personagem--description");
const comicsPersonagem = document.querySelector(".section__personagem--comics");
const nomePersonagem = document.querySelector(".section__personagem--name");
const iconeAnterior = document.querySelector(".icone__paginacao--anterior");
const iconeProximo = document.querySelector(".icone__paginacao--proximo");
const btnPesquisa = document.querySelector(".header__pesquisa--icone")
const ArrayPaginaAcessada = [0];
const url = 'https://marvel-be.herokuapp.com';
let linkImagemPersonagem = "";
let descriptionPersonagem = "";
iconeAnterior.style.display = "none";


mostrarPersonagens(0,12)
function removerDadosSection(){
  nomePersonagem.innerHTML = ""
  imagemPersonagem.innerHTML = "";
  descriptionDiv.innerHTML = "";
  comicsPersonagem.innerHTML = "";
}

function buscarNomePersonagem() {
  const buscarPorNome = document.querySelector("#buscarNome");
  removerDadosSection()
  axios
    .get(`${url}/nome/${buscarPorNome.value}`)
    .then((response) => {
      mostrarDadosPersonagemEscolhido(response);
      sectionInicial.style.display = "none";
      sectionPersonagem.style.display = "flex";
      footer.style.display = "none";

    }).catch(err =>{
      console.error(err)
    });;
    buscarPorNome.value = '';
  }


btnPesquisa.addEventListener("click",buscarNomePersonagem)
document.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    buscarNomePersonagem()
  }
})

function mostrarDadosPersonagemEscolhido(response) {
  const nome = document.createElement("span");
  nome.setAttribute("class", "personagem__nome");
  nomePersonagem.appendChild(nome);
  nome.innerHTML = response.data.nome;

  const imgPersonagem = document.createElement("img");
  if(response.data.imagem == linkSemImagem){
    imgPersonagem.src = './img/logo-marvel.jpg'
  }else{
    imgPersonagem.src = response.data.imagem;
  }

  imagemPersonagem.appendChild(imgPersonagem);

  const pDescription = document.createElement("p");
  pDescription.setAttribute("class", "personagem__description");
  if (response.data.descricao == "") {
    pDescription.innerHTML = "Não informado";
  } else {
    pDescription.innerHTML = response.data.descricao;
  }
  descriptionDiv.appendChild(pDescription);

  const sComics = document.createElement("span");
  sComics.setAttribute("class", "section__comics--header");
  sComics.innerHTML = 'HQs (Comics)'
  comicsPersonagem.appendChild(sComics);

for(let i = 0; i < response.data.teste.length; i++){
  let Titulo = response.data.teste[i].name
  let Imagem = response.data.urls_capas[i]
  HQComics(Titulo,Imagem)
}
}

function HQComics(Titulo,Img){
  let HQComics = document.createElement('li')
  HQComics.setAttribute('class','personagem__comics')
  let HQComicsImg = document.createElement("img");
  HQComicsImg.setAttribute("class", "personagem__comics--img");
  let HQComicsTitulo = document.createElement("span");
  HQComicsTitulo.setAttribute("class", "personagem__comics--titulo");
  if (Img == "semImg" || Img == undefined) {
    HQComicsImg.src = "./img/logo_comics.png";
  } else {
    HQComicsImg.src = Img;
  }
  HQComicsTitulo.innerHTML = Titulo;
  HQComics.appendChild(HQComicsImg)
  HQComics.appendChild(HQComicsTitulo)
  comicsPersonagem.appendChild(HQComics);
}

function mostrarQuantidadePaginas(inicial, final) {
  quantidadePaginas.innerHTML = "";
  for (let i = inicial; i <= final; i++) {
    let numeroPagina = document.createElement("li");
    numeroPagina.setAttribute("id", i);
    numeroPagina.setAttribute("class", "indice__pagina");
    numeroPagina.setAttribute("onclick", "paginaSelecionada(event)");
    numeroPagina.innerHTML = `${i}`;
    quantidadePaginas.appendChild(numeroPagina);
  }
}
mostrarQuantidadePaginas(0, 12);

function anteriorPaginacao() {
  const primeiroIndicePagina = quantidadePaginas.firstChild.innerHTML;
  inicial = parseInt(primeiroIndicePagina) - 12;
  final = inicial + 12;
  verificarPaginacao(inicial, final);
}

function proximaPaginacao() {
  const ultimoIndicePagina = quantidadePaginas.lastChild.innerHTML;
  final = parseInt(ultimoIndicePagina) + 12;
  inicial = final - 12;
  verificarPaginacao(inicial, final);
}

function verificarPaginacao(inicial, final) {
  if (inicial <= 0) {
    inicial = 0;
    iconeAnterior.style.display = "none";
  } else {
    iconeAnterior.style.display = "flex";
  }
  if (final >= 119) {
    final = 119;
    inicio = final - 12;
    iconeProximo.style.display = "none";
  } else {
    iconeProximo.style.display = "flex";
  }
  mostrarQuantidadePaginas(inicial, final);
}

iconeAnterior.addEventListener("click", anteriorPaginacao);
iconeProximo.addEventListener("click", proximaPaginacao);

function mostrarPaginaAcessada(event) {
  if (ArrayPaginaAcessada[0].classList == undefined) {
    ArrayPaginaAcessada.splice(0, 1);
  } else {
    ArrayPaginaAcessada[0].classList.remove("marcar-pagina");
    ArrayPaginaAcessada.splice(0, 1);
  }
  let primeiroAcesso = event.target;
  primeiroAcesso.classList.add("marcar-pagina");
  ArrayPaginaAcessada.push(primeiroAcesso);
}

function paginaSelecionada(event) {
  console.log(typeof(event))
    sectionInicial.innerHTML = "";
    let paginaClicada = event.target.id
    let inicio = paginaClicada * 13;
    let fim = inicio + 12;
    mostrarPaginaAcessada(event);
    mostrarPersonagens(inicio, fim);
  }
function mostrarPersonagens(inicio, final) {
  sectionInicial.innerHTML = "";

  axios
    .get(`${url}/pagina/${inicio}/${final}`)
    .then((response) => {
      const resposta = response.data.personagens;

      resposta.forEach((res) => {
        const liPersonagem = document.createElement("li");
        liPersonagem.setAttribute("class", `card`);
        liPersonagem.setAttribute("onclick", `pegarNome(event)`);
        liPersonagem.setAttribute("id", `id${res.id}`);
        if (res.imagem == linkSemImagem) {
          res.imagem = "./img/logo-marvel.jpg";
        }
        liPersonagem.innerHTML = `
            <span class="card__nome">${res.nome}</span>
            <img class="card__imagem" src="${res.imagem}">
            `;
        sectionInicial.appendChild(liPersonagem);
      });
    })
    .catch((error) => console.error(error));
}

function pegarNome(event) {
  sectionInicial.style.display = "none";
  sectionPersonagem.style.display = "flex";
  footer.style.display = "none";
  verificarDadosPersonagemEscolhido(event.target.innerHTML);
}
voltar.addEventListener("click", voltarPagina);

function voltarPagina() {
  sectionInicial.style.display = "flex";
  sectionPersonagem.style.display = "none";
  footer.style.display = "flex";
  removerDadosSection();
}

function verificarDadosPersonagemEscolhido(nome) {
  axios.get(`${url}/nome/${nome}`).then((response) => {
  mostrarDadosPersonagemEscolhido(response);
  }).catch(err =>{
    console.error(err)
  });
}
