document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("customForm");
    const resultDiv = document.getElementById("result");
    const submitBtn = document.getElementById("submitBtn");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent page reload

        // Collect Values
        const data = {
            name: document.getElementById("name").value.trim(),
            surname: document.getElementById("surname").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: document.getElementById("address").value.trim(),
            r1: Number(document.getElementById("rate1").value),
            r2: Number(document.getElementById("rate2").value),
            r3: Number(document.getElementById("rate3").value)
        };

        console.log(data);

        // Display data under form
        resultDiv.innerHTML = `
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Surname:</strong> ${data.surname}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Address:</strong> ${data.address}</p>
        `;

        // Calculate average
        let avg = (data.r1 + data.r2 + data.r3) / 3;

        let color = "black";
        if (avg <= 4) color = "red";
        else if (avg <= 7) color = "orange";
        else color = "green";

        resultDiv.innerHTML += `
            <p style="font-size:18px; font-weight:bold; color:${color};">
                ${data.name} ${data.surname}: ${avg.toFixed(2)}
            </p>
        `;

        // Popup
        showPopup("Form submitted successfully!");
    });
});

// Popup Function
function showPopup(message) {
    const popup = document.createElement("div");
    popup.classList.add("popupSuccess");
    popup.innerText = message;
    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add("show"), 10);

    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 300);
    }, 2000);
}

// OPTIONAL TASK: REAL-TIME VALIDATION + PHONE MASK + DISABLE SUBMIT

const inputs = {
    name: document.getElementById("name"),
    surname: document.getElementById("surname"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    address: document.getElementById("address"),
    r1: document.getElementById("rate1"),
    r2: document.getElementById("rate2"),
    r3: document.getElementById("rate3")
};

const submitBtn = document.getElementById("submitBtn");

function showError(input, message) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    let error = input.nextElementSibling;
    if (!error || !error.classList.contains("error-text")) {
        error = document.createElement("small");
        error.classList.add("error-text");
        input.parentNode.appendChild(error);
    }
    error.innerText = message;
}

function clearError(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");

    let error = input.nextElementSibling;
    if (error && error.classList.contains("error-text")) {
        error.remove();
    }
}

function validateFields() {
    let valid = true;

    // Name validation
    if (inputs.name.value.trim() === "" || !/^[A-Za-z]+$/.test(inputs.name.value)) {
        showError(inputs.name, "Name must contain only letters.");
        valid = false;
    } else clearError(inputs.name);

    // Surname validation
    if (inputs.surname.value.trim() === "" || !/^[A-Za-z]+$/.test(inputs.surname.value)) {
        showError(inputs.surname, "Surname must contain only letters.");
        valid = false;
    } else clearError(inputs.surname);

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email.value)) {
        showError(inputs.email, "Invalid email format.");
        valid = false;
    } else clearError(inputs.email);

    // Address validation
    if (inputs.address.value.trim().length < 4) {
        showError(inputs.address, "Address is too short.");
        valid = false;
    } else clearError(inputs.address);

    // Rating validation
    [inputs.r1, inputs.r2, inputs.r3].forEach(rating => {
        if (rating.value < 1 || rating.value > 10) {
            showError(rating, "Value must be between 1–10.");
            valid = false;
        } else clearError(rating);
    });

    // Phone validation → sadece sayı + doğru uzunluk
    let digits = inputs.phone.value.replace(/\D/g, "");
    if (digits.length !== 11) {
        showError(inputs.phone, "Phone must be Lithuanian format.");
        valid = false;
    } else clearError(inputs.phone);

    submitBtn.disabled = !valid;
}

// PHONE MASKING
inputs.phone.addEventListener("input", () => {
    let digits = inputs.phone.value.replace(/\D/g, "");

    if (digits.startsWith("370") === false) {
        digits = "370" + digits; // otomatik +370 eklemez, sadece kontrol eder
    }

    digits = digits.substring(0, 11);

    let formatted = "";

    if (digits.length > 0) formatted = "+" + digits.substring(0, 3);
    if (digits.length > 3) formatted += " " + digits.substring(3, 4);
    if (digits.length > 4) formatted += digits.substring(4, 7);
    if (digits.length > 7) formatted += " " + digits.substring(7, 12);

    inputs.phone.value = formatted;

    validateFields();
});

// REAL-TIME VALIDATION
Object.values(inputs).forEach(input => {
    input.addEventListener("input", validateFields);
});

// Başlangıçta submit disabled
submitBtn.disabled = true;

/* ============================================
   MEMORY GAME – Flip Card
   Created by Aliberk Yüce | Script Programming LAB12
============================================ */

/* ---------- ICON DATASETS ---------- */
const iconsEasy = ["🍎", "🚗", "🐶", "⭐", "🎮", "⚽"]; // 6 pairs
const iconsHard = [
  "🍎", "🚗", "🐶", "⭐", "🎮", "⚽",
  "🎵", "📱", "🚀", "🎲", "🏀", "💡"
]; // 12 pairs

/* ---------- DOM ELEMENTS ---------- */
const board = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");
const timerEl = document.getElementById("timer");
const winMessage = document.getElementById("winMessage");
const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("startGame");
const restartBtn = document.getElementById("restartGame");

/* ---------- GAME STATE ---------- */
let firstCard = null;
let secondCard = null;
let lock = false;
let moves = 0;
let matches = 0;
let cardSet = [];

/* ---------- TIMER ---------- */
let timer = 0;
let timerInterval = null;

function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerEl.textContent = timer;

  timerInterval = setInterval(() => {
    timer++;
    timerEl.textContent = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

/* ---------- BEST SCORE ---------- */
function loadBestScores() {
  document.getElementById("bestEasy").textContent =
    localStorage.getItem("bestEasy") || "–";
  document.getElementById("bestHard").textContent =
    localStorage.getItem("bestHard") || "–";
}

function updateBestScore() {
  if (moves === 0) return;

  const key =
    difficultySelect.value === "easy" ? "bestEasy" : "bestHard";

  const stored = localStorage.getItem(key);

  if (!stored || moves < Number(stored)) {
    localStorage.setItem(key, moves);
    document.getElementById(key).textContent = moves;
  }
}

/* ---------- SHUFFLE ---------- */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* ---------- GENERATE BOARD ---------- */
function generateBoard() {
  board.innerHTML = "";
  winMessage.textContent = "";
  moves = 0;
  matches = 0;

  movesEl.textContent = moves;
  matchesEl.textContent = matches;

  startTimer();

  let cols, rows, icons;

  if (difficultySelect.value === "easy") {
    cols = 4;
    rows = 3;
    icons = iconsEasy;
  } else {
    cols = 6;
    rows = 4;
    icons = iconsHard;
  }

  cardSet = shuffle([...icons, ...icons]);

  board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
  board.style.gridTemplateRows = `repeat(${rows}, 120px)`;

  cardSet.forEach(icon => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.dataset.icon = icon;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">❓</div>
        <div class="card-back">${icon}</div>
      </div>
    `;

    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

/* ---------- GAME LOGIC ---------- */
function flipCard() {
  if (lock || this === firstCard || this.classList.contains("matched")) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesEl.textContent = moves;

  checkMatch();
}

function checkMatch() {
  const match = firstCard.dataset.icon === secondCard.dataset.icon;

  match ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  matches++;
  matchesEl.textContent = matches;

  resetTurn();

  if (matches === cardSet.length / 2) showWinMessage();
}

function unflipCards() {
  lock = true;

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetTurn();
  }, 800);
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lock = false;
}

/* ---------- WIN ---------- */
function showWinMessage() {
  stopTimer();
  updateBestScore();

  winMessage.textContent = "🎉 Congratulations! You matched all pairs!";
}

/* ---------- EVENTS ---------- */
startBtn.addEventListener("click", generateBoard);
restartBtn.addEventListener("click", generateBoard);
difficultySelect.addEventListener("change", generateBoard);

/* ---------- INIT ---------- */
loadBestScores();











