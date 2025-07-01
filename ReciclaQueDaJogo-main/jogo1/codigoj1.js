const lixos = [
  { nome: "Banana", tipo: "organico", img: "./img/banana.webp" },
  { nome: "Garrafa PET", tipo: "reciclavel", img: "./img/garrafa.avif" },
  { nome: "Lata de Refrigerante", tipo: "reciclavel", img: "./img/refri.png" },
  { nome: "Jornal", tipo: "reciclavel", img: "./img/jornal.png" },
  { nome: "Copo de Vidro", tipo: "reciclavel", img: "./img/copo.png" },
  { nome: "Seringa", tipo: "perigoso", img: "./img/seringa.png" }
  
];

let lixosAtuais = [];

function getRandomUniqueItem(usedItems) {
  const unused = lixos.filter(lixo => !usedItems.includes(lixo));
  if (unused.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * unused.length);
  return unused[randomIndex];
}

function resetGame() {
  const container = document.getElementById("lixos-container");
  container.innerHTML = "";

  // Embaralha e seleciona SEM repetição
  const shuffled = [...lixos].sort(() => 0.5 - Math.random());
  lixosAtuais = shuffled.slice(0, 6);

  lixosAtuais.forEach((lixo, index) => {
    createAndAppendTrash(lixo, index);
  });

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
  const indexOriginal = parseInt(e.dataTransfer.getData("index"));

  const feedbackZone = this.querySelector(".feedback-zone");
  feedbackZone.innerHTML = "";

  const feedback = document.createElement("div");
  feedback.classList.add("feedback");

  if (tipoArrastado === tipoCorreto) {
    feedback.textContent = "✅ Acertou!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = "❌ Errou!";
    feedback.style.color = "red";
  }

  feedbackZone.appendChild(feedback);
  setTimeout(() => {
    feedback.remove();
  }, 2000);

  // Remover item antigo
  const container = document.getElementById("lixos-container");
  const items = container.querySelectorAll("img");
  if (items[indexOriginal]) {
    items[indexOriginal].remove();
    lixosAtuais.splice(indexOriginal, 1);

    // Adicionar novo item aleatório (não repetido)
    const newItem = getRandomUniqueItem(lixosAtuais);
    if (newItem) {
      lixosAtuais.push(newItem);
      createAndAppendTrash(newItem, lixosAtuais.length - 1);
    }
  }
}

document.getElementById("reset-button").addEventListener("click", resetGame);

resetGame();