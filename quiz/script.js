const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const sendbtn = document.getElementById("send-btn");
const restartbtn = document.getElementById("restart-btn");
let currentquestion = 0;
let lives = 3;

const questions = [
  {
    question: "Qual lixo vai no recipiente verde?",
    options: ["Papel", "Plástico", "Vidro", "Metal"],
    answer: "Vidro"
  },
  {
    question: "O papel vai no recipiente...",
    options: ["Azul", "Amarelo", "Verde", "Laranja"],
    answer: "Azul"
  },
  {
    question: "As latas de metal vão no recipiente...",
    options: ["Azul", "Amarelo", "Verde", "Laranja"],
    answer: "Amarelo"
  },
  {
    question: "O lixo orgânico (resto de comida) vai no recipiente...",
    options: ["Verde", "Amarelo", "Marrom", "Azul"],
    answer: "Marrom"
  },
  {
    question: "O vidro vai em qual lixeira?",
    options: ["Amarelo", "Verde", "Marrom", "Azul"],
    answer: "Verde"
  },
  {
    question: "O que não deve ir no lixo comum?",
    options: ["Bateria", "Lata", "Garrafa", "Vidro"],
    answer: "Bateria"
  },
  {
    question: "Em qual lixeira os lixos perigosos?",
    options: ["Laranja", "Amarelo", "Azul", "Verde"],
    answer: "Laranja"
  },
  {
    question: "O que é reciclagem?",
    options: ["Jogar lixo no chão", "Separar lixo errado", "Reutilizar materiais", "Queimar lixo"],
    answer: "Reutilizar materiais"
  }
];

function loadquestion() {
  if (lives <= 0) {
    quiz.innerHTML = "<p>💀 Suas vidas acabaram! Fim de jogo.</p>";
    result.innerHTML = "";
    sendbtn.style.display = "none";
    restartbtn.style.display = "inline-block";
    return;
  }

  if (currentquestion >= questions.length) {
    quiz.innerHTML = "<p>🎉 Parabéns! Você terminou o quiz!</p>";
    result.innerHTML = "<p>Agora, volte para a página principal e confira o outro jogo!</p>";
    sendbtn.style.display = "none";
    restartbtn.style.display = "inline-block";
    return;
  }

  const q = questions[currentquestion];
  quiz.innerHTML = `
    <p><strong>${q.question}</strong></p>
    <form id="quizForm">
      ${q.options.map(option => `
        <label>
          <input type="radio" name="answer" value="${option}">
          ${option}
        </label><br><br>
      `).join("")}
    </form>
  `;
  result.innerHTML = "";
  document.querySelector("p.lives").innerText = "Vidas restantes: " + lives;
}

function checkanswer() {
  if (lives <= 0 || currentquestion >= questions.length) return;

  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) {
    result.innerHTML = "<p style='color:red;'>Selecione uma opção!</p>";
    return;
  }

  const answer = selected.value;
  const correct = questions[currentquestion].answer;

  if (answer === correct) {
    result.innerHTML = `<p style='color:green;'>✅ Correto! ${correct} é a resposta certa.</p>`;
  } else {
    lives--;
    result.innerHTML = `<p style='color:red;'>❌ Errado. A resposta correta é: ${correct}.</p>`;
    document.querySelector("p.lives").innerText = "Vidas restantes: " + lives;
    if (lives <= 0) {
      quiz.innerHTML = "<p>💀 Suas vidas acabaram! Fim de jogo.</p>";
      result.innerHTML = "";
      sendbtn.style.display = "none";
      restartbtn.style.display = "inline-block";
      return;
    }
  }

  setTimeout(() => {
    currentquestion++;
    loadquestion();
  }, 2000);
}

function restartgame() {
  currentquestion = 0;
  lives = 3;
  sendbtn.style.display = "inline-block";
  restartbtn.style.display = "none";
  document.querySelector("p.lives").innerText = "Vidas restantes: " + lives;
  loadquestion();
}

document.body.insertAdjacentHTML("afterbegin", "<p class='lives' style='text-align:center; font-size:18px; color:#d32f2f;'>Vidas restantes: 3</p>");

loadquestion();