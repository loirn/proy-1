"use strict";

const SENTENCES = {
  easy: [
    { words: ["C", "A", "S", "A"],       hint: "Lugar donde vives." },
    { words: ["P", "E", "R", "R", "O"],         hint: "El mejor amigo del hombre." },
    { words: ["A", "G", "U", "A"],    hint: "Para la sed." },
    { words: ["L", "U", "N", "A"],        hint: "Nuestro satelite natural." },
    { words: ["P", "U", "L", "P", "O"],        hint: "Animal marino de ocho brazos" },
  ],
  medium: [
    { words: ["C", "H", "O", "C", "O", "L", "A", "T", "E"], hint: "Dulce hecho con cacao." },
    { words: ["A", "R", "C", "O", "I", "R", "I", "S"],       hint: "Colorido paisaje del cielo" },
    { words: ["J", "A", "R", "D", "I", "N"], hint: "Lugar lleno de flores" },
    { words: ["C", "I", "N", "E"], hint: "Sala para ver peliculas." },
    { words: ["B", "A", "L", "O", "N"], hint: "Juguete redondo que se patea" },
  ],
  hard: [
    { words: ["E", "S", "T", "R", "E", "L", "L", "A", "S"], hint: "Cuerpos celestes que brillan en el cielo" },
    { words: ["B", "I", "B", "L", "I", "O", "T", "E", "C", "A"], hint: "Coleccion grande de libros" },
    { words: ["C", "O", "M", "P", "U", "T", "A", "D", "O", "R"], hint: "Maquina con teclado" },
    { words: ["R", "E", "S", "P", "I", "R", "A", "C", "I", "O", "N"], hint: "Proceso donde tomamos oxigeno para vivir" },
    { words: ["V", "A", "C", "A", "C", "I", "O", "N", "E", "S"], hint: "Descanso extendido del trabajo" },
  ],
};

let state = {
  score: 0, lives: 3, level: 1, round: 0,
  hintsLeft: 3, timerSecs: 0, timerInterval: null,
  currentWords: [], correctSentence: [],
  builtSentence: [], placed: [], difficulty: "easy",
};

const $ = (id) => document.getElementById(id);
const wordBank  = $("wordBank");
const buildZone = $("buildZone");
const buildPlaceholder = $("buildPlaceholder");

window.addEventListener("DOMContentLoaded", restartGame);

function restartGame() {
  state.score = 0; state.lives = 3; state.level = 1;
  state.round = 0; state.hintsLeft = 3; state.difficulty = "easy";
  updateHUD();
  hideModal("gameOverOverlay");
  hideModal("modalOverlay");
  loadRound();
}

function loadRound() {
  const pool = SENTENCES[state.difficulty];
  const data = pool[state.round % pool.length];

  state.correctSentence = [...data.words];
  state.currentWords    = shuffle([...data.words]);
  state.builtSentence   = [];
  state.placed          = [];

  $("hintText").textContent = "💡 " + data.hint;

  buildZone.innerHTML = "";
  buildZone.appendChild(buildPlaceholder);
  buildPlaceholder.style.display = "inline";
  buildZone.classList.remove("correct", "wrong", "drag-over");
  wordBank.innerHTML = "";

  state.currentWords.forEach((word, i) => renderChip(word, i));
  $("hintCount").textContent = state.hintsLeft;
  updateHUD();

  const secs = state.difficulty === "easy" ? 45 : state.difficulty === "medium" ? 35 : 25;
  startTimer(secs);
}

function renderChip(word, index) {
  const chip = document.createElement("span");
  chip.textContent = word;
  chip.className   = "word-chip";
  chip.dataset.idx = index;
  chip.draggable   = true;
  chip.addEventListener("click", () => placeWord(index));
  chip.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", index);
    chip.classList.add("dragging");
  });
  chip.addEventListener("dragend", () => chip.classList.remove("dragging"));
  wordBank.appendChild(chip);
}

function placeWord(index) {
  if (state.placed.includes(index)) return;
  state.placed.push(index);
  state.builtSentence.push(state.currentWords[index]);

  const bankChip = wordBank.querySelector(`[data-idx="${index}"]`);
  if (bankChip) bankChip.classList.add("placed");

  buildPlaceholder.style.display = "none";

  const builtChip = document.createElement("span");
  builtChip.className = "built-chip";
  builtChip.dataset.bankIdx = index;
  builtChip.innerHTML = `${state.currentWords[index]} <span class="remove-x">✕</span>`;
  builtChip.addEventListener("click", () => removeWord(builtChip, index));
  buildZone.appendChild(builtChip);
}

function removeWord(builtChip, index) {
  const bankChip = wordBank.querySelector(`[data-idx="${index}"]`);
  if (bankChip) bankChip.classList.remove("placed");

  const pos = state.placed.indexOf(index);
  if (pos > -1) { state.placed.splice(pos, 1); state.builtSentence.splice(pos, 1); }
  builtChip.remove();
  if (state.builtSentence.length === 0) buildPlaceholder.style.display = "inline";
}

function clearBuild() {
  [...buildZone.querySelectorAll(".built-chip")].forEach(c => c.remove());
  [...wordBank.querySelectorAll(".word-chip")].forEach(c => c.classList.remove("placed"));
  state.builtSentence = []; state.placed = [];
  buildPlaceholder.style.display = "inline";
  buildZone.classList.remove("correct", "wrong");
}

buildZone.addEventListener("dragover",  (e) => { e.preventDefault(); buildZone.classList.add("drag-over"); });
buildZone.addEventListener("dragleave", () => buildZone.classList.remove("drag-over"));
buildZone.addEventListener("drop", (e) => {
  e.preventDefault();
  buildZone.classList.remove("drag-over");
  const idx = parseInt(e.dataTransfer.getData("text/plain"));
  if (!isNaN(idx)) placeWord(idx);
});

function checkAnswer() {
  if (state.builtSentence.length === 0) { shakeBuild(); return; }

  const isCorrect = state.builtSentence.join(" ") === state.correctSentence.join(" ");
  stopTimer();

  if (isCorrect) {
    const bonus = Math.ceil(state.timerSecs * 2);
    const base  = state.difficulty === "easy" ? 100 : state.difficulty === "medium" ? 200 : 350;
    state.score += base + bonus;
    state.round++;
    buildZone.classList.add("correct");
    setTimeout(() => showResultModal(true, state.correctSentence.join(" ")), 300);
  } else {
    state.lives--;
    buildZone.classList.add("wrong");
    shakeBuild();
    setTimeout(() => {
      buildZone.classList.remove("wrong");
      state.lives <= 0 ? showGameOver() : showResultModal(false, state.correctSentence.join(" "));
    }, 400);
  }
  updateHUD();
}

function useHint() {
  if (state.hintsLeft <= 0) return;
  const nextWord = state.correctSentence[state.builtSentence.length];
  if (!nextWord) return;

  for (let i = 0; i < state.currentWords.length; i++) {
    if (state.currentWords[i] === nextWord && !state.placed.includes(i)) {
      const chip = wordBank.querySelector(`[data-idx="${i}"]`);
      if (chip) {
        chip.style.outline    = "2px solid #3cffa0";
        chip.style.background = "rgba(60,255,160,.18)";
        setTimeout(() => { chip.style.outline = ""; chip.style.background = ""; }, 1400);
      }
      state.hintsLeft--;
      $("hintCount").textContent = state.hintsLeft;
      break;
    }
  }
}

function nextRound() {
  hideModal("modalOverlay");
  if (state.round >= 3 && state.difficulty === "easy")   { state.difficulty = "medium"; state.level = 2; state.round = 0; state.hintsLeft = 3; }
  else if (state.round >= 3 && state.difficulty === "medium") { state.difficulty = "hard"; state.level = 3; state.round = 0; state.hintsLeft = 2; }
  updateHUD();
  loadRound();
}

function startTimer(secs) {
  stopTimer();
  state.timerSecs = secs;
  const timerBar = $("timerBar");
  const timerLabel = $("timerLabel");
  const total = secs;
  timerBar.style.width = "100%";
  timerBar.classList.remove("warning");
  timerLabel.textContent = secs + "s";
  timerLabel.style.color = "var(--accent)";

  state.timerInterval = setInterval(() => {
    state.timerSecs--;
    timerBar.style.width = Math.max((state.timerSecs / total) * 100, 0) + "%";
    timerLabel.textContent = state.timerSecs + "s";
    if (state.timerSecs <= 10) { timerBar.classList.add("warning"); timerLabel.style.color = "var(--accent2)"; }
    if (state.timerSecs <= 0) { stopTimer(); timeUp(); }
  }, 1000);
}

function stopTimer() { clearInterval(state.timerInterval); state.timerInterval = null; }

function timeUp() {
  state.lives--;
  updateHUD();
  if (state.lives <= 0) { showGameOver(); return; }
  buildZone.classList.add("wrong");
  setTimeout(() => {
    buildZone.classList.remove("wrong");
    showResultModal(false, state.correctSentence.join(" "), true);
  }, 400);
}

function showResultModal(correct, correctAnswer, timedOut = false) {
  $("modalIcon").textContent  = correct ? "🎉" : "😬";
  $("modalTitle").textContent = correct ? "¡Correcto!" : (timedOut ? "¡Tiempo!" : "Incorrecto");
  $("modalBody").textContent  = correct ? "¡Muy bien! Sigue así." : (timedOut ? "Se acabó el tiempo." : "Esa no era la oración correcta.");
  $("modalAnswer").textContent = "Respuesta: " + correctAnswer;
  $("modalOverlay").classList.add("active");
}

function showGameOver() {
  stopTimer();
  $("finalScore").textContent = state.score;
  $("gameOverMsg").textContent = "¡Se acabaron las vidas!";
  $("gameOverOverlay").classList.add("active");
}

function hideModal(id) { $(id).classList.remove("active"); }

function updateHUD() {
  $("scoreDisplay").textContent = state.score;
  $("levelDisplay").textContent = state.level;
  $("livesDisplay").textContent = ["❤","❤","❤"].map((h,i) => i < state.lives ? "❤" : "🖤").join(" ");
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shakeBuild() {
  buildZone.classList.add("wrong");
  setTimeout(() => buildZone.classList.remove("wrong"), 400);
}