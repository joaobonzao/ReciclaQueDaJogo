const lixos = [
  { nome: "Banana", tipo: "organico", img: "./img/banana.webp" },
  { nome: "Garrafa PET", tipo: "reciclavel", img: "./img/garrafa.avif" },
  { nome: "Lata de Refrigerante", tipo: "reciclavel", img: "./img/refri.png" },
  { nome: "Jornal", tipo: "reciclavel", img: "./img/jornal.png" },
  { nome: "Copo de Vidro", tipo: "perigoso", img: "./img/copo.png" },
  { nome: "Seringa", tipo: "perigoso", img: "./img/seringa.png" }
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
  { nome: "Banana", tipo: "organico", img: "./img/banana.webp" },
  { nome: "Garrafa PET", tipo: "reciclavel", img: "./img/garrafa.avif" },
  { nome: "Lata de Refrigerante", tipo: "reciclavel", img: "./img/refri.png" },
  { nome: "Jornal", tipo: "reciclavel", img: "./img/jornal.png" },
  { nome: "Copo de Vidro", tipo: "perigoso", img: "./img/copo.png" },
  { nome: "Seringa", tipo: "perigoso", img: "./img/seringa.png" }
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
    if (vidasDouradas < 3) {
      if (vidas > 0) {
        vidas--;
        vidasDouradas++;
        ganhouDourada = true;
      } else if (vidas === 0) {
        // Se não tem mais corações, só aumenta dourada se não passou do limite
        vidasDouradas = Math.min(vidasDouradas + 1, 3);
        ganhouDourada = true;
      }
    }
    atualizarVidas();
    setTimeout(() => {
      if (ganhouDourada) {
        document.body.classList.add('golden-bg');
        const msg = document.createElement('div');
        msg.className = 'golden-message';
        msg.innerHTML = "<span>⭐ Parabéns! Você ganhou uma vida dourada por chegar na fase " + fase + "! ⭐</span>";
        document.body.appendChild(msg);
        setTimeout(() => {
          msg.remove();
          document.body.classList.remove('golden-bg');
        }, 1800);
      } else if (vidas < 3 && vidasDouradas < 3) {
        alert("Parabéns! Você ganhou +1 vida por chegar na fase " + fase + "!");
      }
    }, 300);
  }
  iniciarFase();
}

function iniciarFase() {
  lixosRestantes = [];
  // Repete os lixosFase1 até atingir o número de imagens desejado
  while (lixosRestantes.length < maxImagens) {
    lixosRestantes = lixosRestantes.concat(lixosFase1);
  }
  lixosRestantes = lixosRestantes.slice(0, maxImagens).sort(() => 0.5 - Math.random());
  lixosAtuais = [];
  const container = document.getElementById("lixos-container");
  container.innerHTML = "";
  for (let i = 0; i < maxImagens && lixosRestantes.length > 0; i++) {
    const lixo = getRandomUniqueItem();
    if (lixo) {
      lixosAtuais.push(lixo);
      createAndAppendTrash(lixo, lixosAtuais.length - 1);
    }
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
    // Adicionar novo item aleatório (não repetido)
    const newItem = getRandomUniqueItem();
    if (newItem) {
      lixosAtuais.push(newItem);
      createAndAppendTrash(newItem, lixosAtuais.length - 1);
    }
  }

  // Se não há mais imagens visíveis, avança de fase ou termina
  if (lixosAtuais.length === 0 && lixosRestantes.length === 0) {
    setTimeout(() => {
      if (fase === 1) {
        mostrarBotaoFase();
      } else {
        mostrarBotaoFase();
      }
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