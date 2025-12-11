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
   MEMORY GAME – Flip Card Version
   Created by Aliberk Yüce | Script Programming LAB12
   ============================================ */

// Emoji Dataset (6 unique items → duplicates → full set)
const icons = ["🍎", "🚗", "🐶", "⭐", "🎮", "⚽"];

// DOM Elements
const board = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");
const winMessage = document.getElementById("winMessage");
const startBtn = document.getElementById("startGame");
const restartBtn = document.getElementById("restartGame");
const difficultySelect = document.getElementById("difficulty");

// Game State
let firstCard = null;
let secondCard = null;
let lock = false;
let moves = 0;
let matches = 0;
let cardSet = [];

/* -----------------------------------------
   TIMER + BEST SCORE SYSTEM
------------------------------------------- */

let timer = 0;
let timerInterval = null;

// Load saved best scores
let bestEasy = localStorage.getItem("bestEasy") || "–";
let bestHard = localStorage.getItem("bestHard") || "–";

// Update HTML on load
document.getElementById("bestEasy").textContent = bestEasy;
document.getElementById("bestHard").textContent = bestHard;

// Start timer
function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  document.getElementById("timer").textContent = timer;

  timerInterval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = timer;
  }, 1000);
}

// Stop timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Check + Save Best Score
function updateBestScore() {
  let difficulty = difficultySelect.value;
  let key = difficulty === "easy" ? "bestEasy" : "bestHard";
  let currentBest = localStorage.getItem(key);

  // Save if no best score OR current score is lower
  if (!currentBest || timer < Number(currentBest)) {
    localStorage.setItem(key, timer);
    document.getElementById(key).textContent = timer;
  }
}


/* -----------------------------------------
   UTILITY — Shuffle Array
------------------------------------------- */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

/* -----------------------------------------
   CREATE GAME BOARD
------------------------------------------- */
function generateBoard() {
  board.innerHTML = "";
  winMessage.textContent = "";
  moves = 0;
  matches = 0;

  movesEl.textContent = moves;
  matchesEl.textContent = matches;

  // Build deck
  cardSet = [...icons, ...icons];
  cardSet = shuffle(cardSet);

  // Layout for difficulty
  let cols, rows;
  if (difficultySelect.value === "easy") {
    cols = 4;
    rows = 3;
  } else {
    cols = 6;
    rows = 4;
  }

  board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
  board.style.gridTemplateRows = `repeat(${rows}, 120px)`;

  // Create cards
  cardSet.forEach(icon => {
    const card = document.createElement("div");
    card.classList.add("memory-card");
    card.dataset.icon = icon;

    // Card inner structure
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

/* -----------------------------------------
   CARD FLIP LOGIC
------------------------------------------- */
function flipCard() {
  if (lock) return;
  if (this.classList.contains("matched")) return;
  if (this === firstCard) return;

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

/* -----------------------------------------
   CHECK MATCH
------------------------------------------- */
function checkMatch() {
  const match = firstCard.dataset.icon === secondCard.dataset.icon;

  if (match) {
    disableCards();
  } else {
    unflipCards();
  }
}

/* -----------------------------------------
   MATCHED PAIR
------------------------------------------- */
function disableCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  matches++;
  matchesEl.textContent = matches;

  resetTurn();

  if (matches === icons.length) showWinMessage();
}

/* -----------------------------------------
   UNFLIP NON-MATCHING CARDS
------------------------------------------- */
function unflipCards() {
  lock = true;

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");

    resetTurn();
  }, 900);
}

/* -----------------------------------------
   RESET TURN
------------------------------------------- */
function resetTurn() {
  firstCard = null;
  secondCard = null;
  lock = false;
}

/* -----------------------------------------
   WIN MESSAGE ANIMATION
------------------------------------------- */
function showWinMessage() {
  winMessage.textContent = "🎉 Congratulations! You matched all pairs!";
  winMessage.style.opacity = 0;

  setTimeout(() => {
    winMessage.style.transition = "opacity 0.6s ease-out";
    winMessage.style.opacity = 1;
  }, 100);
}

/* -----------------------------------------
   BUTTON EVENTS
------------------------------------------- */
startBtn.addEventListener("click", generateBoard);
restartBtn.addEventListener("click", generateBoard);
difficultySelect.addEventListener("change", generateBoard);

