const lixos = [
  //organicos
  { nome: "Maçã", tipo: "organico", img: "./img/maca.png" },
  { nome: "Peixe", tipo: "organico", img: "./img/peixe.png" },
  { nome: "Carne", tipo: "organico", img: "./img/carne.png" },
  { nome: "Banana", tipo: "organico", img: "./img/banana.png" },
  { nome: "Casca de Ovo", tipo: "organico", img: "./img/cascadeovo.png" },
  { nome: "melancia", tipo: "organico", img: "./img/melancia.png" },
  { nome: "Cenoura", tipo: "organico", img: "./img/cenoura.png" },
  { nome: "tomate", tipo: "organico", img: "./img/tomate.png" },
  { nome: "lata de atum", tipo: "metal", img: "./img/atum.png" },
  { nome: "lata de milho", tipo: "metal", img: "./img/latamilho.png" },
  { nome: "lata de ervilha", tipo: "metal", img: "./img/ervilha.png" },
  { nome: "lata de feijão", tipo: "metal", img: "./img/feijao.png" },
  //reciclaveis
  { nome: "Garrafa PET", tipo: "reciclavel", img: "./img/pet.png" },
  { nome: "Jornal", tipo: "reciclavel", img: "./img/jornal.png" },
  { nome: "Caixa de Papelão", tipo: "reciclavel", img: "./img/caixa.png" },
 
  //perigosos
  { nome: "Seringa", tipo: "perigoso", img: "./img/seringa.png" },
  { nome: "Faca", tipo: "perigoso", img: "./img/faca.png" },
  { nome: "tesoura", tipo: "perigoso", img: "./img/tesoura.png" },
 
  //metais
  { nome: "Lata de Refrigerante", tipo: "metal", img: "./img/refri.png" },
  
  { nome: "prego", tipo: "metal", img: "./img/prego.png" },
  { nome: "garfo", tipo: "metal", img: "./img/garfo.png" },
  
 
  //vidros
  { nome: "Copo de Vidro", tipo: "vidro", img: "./img/copo.png" },
  { nome: "Prato de Vidro", tipo: "vidro", img: "./img/pratoquebrado.png" }
 
  
 
 
  
];

let lixosAtuais = [];
let lixosRestantes = [];
let pontos = 0;
let maxImagens = 5;
let errosSeguidos = 0;
const MAX_ERROS = 3;
let vidas = 3;
let vidasDouradas = 0; // 0 a 3
let fase = 1;

const lixosFase1 = [
    { nome: "Banana", tipo: "organico", img: "./img/banana.png" },
  { nome: "Garrafa PET", tipo: "reciclavel", img: "./img/pet.png" },
  { nome: "Lata de Refrigerante", tipo: "metal", img: "./img/refri.png" },
  { nome: "Jornal", tipo: "reciclavel", img: "./img/jornal.png" },
  { nome: "Copo de Vidro", tipo: "vidro", img: "./img/copo.png" },
  { nome: "Seringa", tipo: "perigoso", img: "./img/seringa.png" },
  { nome: "Maçã", tipo: "organico", img: "./img/maca.png" },
  { nome: "Peixe", tipo: "organico", img: "./img/peixe.png" },
  { nome: "Carne", tipo: "organico", img: "./img/carne.png" }
  
  
];

const lixosFase2 = [
  ...lixosFase1,
  ...lixosFase1,
  ...lixosFase1
  
];

function atualizarPontuacao() {
  const span = document.getElementById("pontuacao");
  if (span) span.textContent = pontos;
}

function atualizarVidas() {
  const span = document.getElementById("vidas");
  let coracoes = "";
  if (vidasDouradas > 0) {
    coracoes = "❤".repeat(3 - vidasDouradas);
    for (let i = 0; i < vidasDouradas; i++) {
      coracoes += "<span style='color:gold;filter:drop-shadow(0 0 4px gold);'>⭐</span>";
    }
  } else {
    coracoes = "❤".repeat(vidas);
  }
  if (span) span.innerHTML = coracoes;
}

function getRandomUniqueItem() {
  if (lixosRestantes.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * lixosRestantes.length);
  const item = lixosRestantes[randomIndex];
  lixosRestantes.splice(randomIndex, 1);
  return item;
}

function resetGame() {
  const container = document.getElementById("lixos-container");
  container.innerHTML = "";
  pontos = 0;
  maxImagens = 5;
  errosSeguidos = 0;
  vidas = 3;
  vidasDouradas = 0;
  fase = 1;
  atualizarPontuacao();
  atualizarVidas();
  iniciarFase();
}

function proximaFase() {
  fase++;
  maxImagens = 5 + (fase - 1) * 2;

  if (fase % 3 === 0) {
    let ganhouDourada = false;
    let ganhouVida = false;

    // Só ganha dourada se chegar com todas as vidas
    if ((vidas + vidasDouradas) >= 3 && vidasDouradas < 3) {
  if (vidas > 0) vidas--;
  vidasDouradas++;
  ganhouDourada = true;
} else if (vidas < 3 && vidasDouradas < 3) {
  vidas = Math.min(vidas + 1, 3); // Ganha só uma vida normal
  ganhouVida = true;
}
    atualizarVidas();
    setTimeout(() => {
      if (ganhouDourada) {
  if (!document.querySelector('.golden-message')) {
    document.body.classList.add('golden-bg');
    const msg = document.createElement('div');
    msg.className = 'golden-message';
    msg.innerHTML = "<span>⭐ Parabéns! Você ganhou uma vida dourada por chegar na fase " + fase + " sem perder vidas! ⭐</span>";
    document.body.appendChild(msg);
    setTimeout(() => {
      msg.remove();
      document.body.classList.remove('golden-bg');
    }, 1800);
        }
} else if (ganhouVida) {
  alert("Parabéns! Você ganhou +1 vida por chegar na fase " + fase + "!");
}
    }, 300);
  }
  iniciarFase();
}


function iniciarFase() {
  lixosRestantes = [];
  // Define o número de itens únicos por fase
  maxImagens = 5 + (fase - 1) * 2;
  // Embaralha o array de lixos
  let pool = [...lixos].sort(() => 0.5 - Math.random());
  // Seleciona apenas itens únicos para a rodada
  lixosRestantes = pool.slice(0, Math.min(maxImagens, pool.length));
  lixosAtuais = [...lixosRestantes];
  const container = document.getElementById("lixos-container");
  container.innerHTML = "";
  for (let i = 0; i < lixosAtuais.length; i++) {
    createAndAppendTrash(lixosAtuais[i], i);
  }
  setupDropZones();
}

function createAndAppendTrash(lixo, index) {
  const container = document.getElementById("lixos-container");

  const img = document.createElement("img");
  img.src = lixo.img;
  img.alt = lixo.nome;
  img.classList.add("lixo");
  img.setAttribute("draggable", true);
  img.dataset.tipo = lixo.tipo;
  img.dataset.index = index;

  img.addEventListener("dragstart", dragStart);
  container.appendChild(img);
}
function setupDropZones() {
  const dropZones = document.querySelectorAll(".lixeira");

  dropZones.forEach(zone => {
    zone.addEventListener("dragover", dragOver);
    zone.addEventListener("drop", drop);
    // Impede que a lixeira seja arrastada
    zone.addEventListener("dragstart", function(e) {
      e.preventDefault();
    });
  });
}

function dragStart(e) {
  e.dataTransfer.setData("tipo", this.dataset.tipo);
  e.dataTransfer.setData("src", this.src);
  e.dataTransfer.setData("index", this.dataset.index);
  e.dataTransfer.setDragImage(this, 0, 0);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();

  const tipoCorreto = this.dataset.tipo;
  const tipoArrastado = e.dataTransfer.getData("tipo");
  const srcArrastado = e.dataTransfer.getData("src");

  const feedbackZone = this.querySelector(".feedback-zone");
  feedbackZone.innerHTML = "";

  const feedback = document.createElement("div");
  feedback.classList.add("feedback");

  let acertou = false;
  if (tipoArrastado === tipoCorreto) {
    feedback.textContent = "✅ Acertou!";
    feedback.style.color = "green";
    pontos++;
    errosSeguidos = 0;
    acertou = true;
  } else {
    feedback.textContent = "❌ Errou!";
    feedback.style.color = "red";
    pontos = Math.max(0, pontos - 1);
    errosSeguidos++;
    if (vidasDouradas > 0) {
      vidasDouradas--;
      if (vidas < 3) vidas++;
      atualizarVidas();
    } else {
      vidas--;
      atualizarVidas();
      if (vidas <= 0 && vidasDouradas === 0) {
        setTimeout(() => {
          alert("Suas vidas acabaram! O jogo será reiniciado.");
          resetGame();
        }, 500);
        return;
      }
    }
  }
  atualizarPontuacao();

  feedbackZone.appendChild(feedback);
  setTimeout(() => {
    feedback.remove();
  }, 2000);

  // Remover item antigo de lixosAtuais pelo src
  const container = document.getElementById("lixos-container");
  const items = container.querySelectorAll("img");
  let indexToRemove = -1;
  lixosAtuais.forEach((lixo, idx) => {
    if (container.children[idx] && container.children[idx].src === srcArrastado) {
      indexToRemove = idx;
    }
  });
  if (indexToRemove !== -1 && items[indexToRemove]) {
    items[indexToRemove].remove();
    lixosAtuais.splice(indexToRemove, 1);
  }

  // Se não há mais imagens visíveis, avança de fase
  if (lixosAtuais.length === 0) {
    setTimeout(() => {
      mostrarBotaoFase();
    }, 500);
    return;
  }
}

function mostrarBotaoFase() {
  const botao = document.getElementById("botao-fase");
  botao.textContent = `Ir para a Fase ${fase + 1} 🚀`;
  botao.style.display = "block";
}
function esconderBotaoFase() {
  const botao = document.getElementById("botao-fase");
  botao.style.display = "none";
}

document.getElementById("botao-fase").addEventListener("click", () => {
  esconderBotaoFase();
  proximaFase();
});

document.getElementById("reset-button").addEventListener("click", resetGame);

resetGame();