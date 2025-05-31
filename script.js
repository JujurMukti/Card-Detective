const popup = document.getElementById('popup');
const cardText = document.getElementById('cardText');
const img = document.getElementById('cardImage');
const miniGrid = document.getElementById('miniGrid');
const submitBtn = document.getElementById('submitBtn');
const attemptsEl = document.getElementById("attempts");
const easterEgg = document.getElementById("easter");

const soundCorrect = document.getElementById("sound-correct");
const soundIncorrect = document.getElementById("sound-incorrect");
const soundGameOver = document.getElementById("sound-gameover");

const correctCards = [7, 18];

let revealedCard = [];
let currentCard = 1;
let attemptsLeft = 3;
let playPopup = false;

function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.volume = 1;
  sound.play();
}

function updateAttemptsDisplay() {
  attemptsEl.innerHTML = `<strong id="heart" style="color: ${attemptsLeft > 1 ? '#4CAF50' : 'red'}">${attemptsLeft}</strong> Attempt${attemptsLeft !== 1 ? 's' : ''} Remaining`;
}

function showPopup(message, isSuccess) {
  playPopup = true;
  popup.innerHTML = `<div class="popup-box">${message}</div>`;
  popup.style.backgroundColor = isSuccess ? 'rgba(47, 255, 0, 0.6)' : 'rgba(244, 37, 37, 0.6)';
  popup.classList.add('show');
  if (!isSuccess && message !== "GAME OVER!") {
    setTimeout(() => {
      popup.classList.remove('show');
      playPopup = false;
    }, 2000);
  }
}

function updateCardDisplay() {
  img.src = `cards/${currentCard}.png`;
  if (revealedCard.includes(currentCard)) {
    const color = correctCards.includes(currentCard) ? '#6b9a40' : 'red';
    cardText.innerHTML = `Card ${currentCard} <span style="color: ${color};">(Revealed)</span>`;
    submitBtn.disabled = true;
  } else {
    cardText.textContent = `Card ${currentCard}`;
    submitBtn.disabled = false;
  }
}

function showMiniGrid(kind) {
  const overlay = document.createElement('div');
  overlay.id = 'overlayGrid';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = 1000;
  overlay.style.animation = 'fadeIn 0.3s ease';

  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.background = '#fff';
  container.style.borderRadius = '15px';
  container.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
  container.style.maxWidth = '75%';
  container.style.maxHeight = '100%';
  container.style.overflow = 'visible';
  container.style.margin = '40px auto';
  container.style.padding = '20px 20px 30px';

  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '5px';
  closeButton.style.right = '15px';
  closeButton.style.zIndex = '10';
  closeButton.style.fontSize = '1.5rem';
  closeButton.style.backgroundColor = '#f44336';
  closeButton.style.color = '#fff';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '50%';
  closeButton.style.width = '36px';
  closeButton.style.height = '36px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.display = 'flex';
  closeButton.style.alignItems = 'center';
  closeButton.style.justifyContent = 'center';
  closeButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  closeButton.addEventListener('click', () => {
    overlay.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => document.body.removeChild(overlay), 300);
  });

  const bigGrid = document.createElement('div');
  bigGrid.style.display = 'grid';
  bigGrid.style.gridTemplateColumns = 'repeat(5, 60px)';
  bigGrid.style.gap = '15px';
  bigGrid.style.marginTop = '40px';

  for (let i = 1; i <= 20; i++) {
    const cell = document.createElement('div');
    cell.textContent = i;
    cell.style.display = 'flex';
    cell.style.justifyContent = 'center';
    cell.style.alignItems = 'center';
    cell.style.backgroundColor = '#f0f0f0';
    cell.style.border = '1px solid #ccc';
    cell.style.borderRadius = '8px';
    cell.style.cursor = 'pointer';
    cell.style.fontWeight = 'bold';
    cell.style.fontSize = '18px';
    cell.style.height = '40px';
    cell.addEventListener('click', () => {
      if (kind === 0) {
        currentCard = i;
      } else {
        revealedCard.push(i);
      }
      updateCardDisplay();
      overlay.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => document.body.removeChild(overlay), 300);
    });
    bigGrid.appendChild(cell);
  }

  container.appendChild(closeButton);
  container.appendChild(bigGrid);
  overlay.appendChild(container);
  document.body.appendChild(overlay);
}

submitBtn.addEventListener('click', () => {
  if (playPopup) return;

  revealedCard.push(currentCard);
  updateCardDisplay();
  const isCorrect = correctCards.includes(currentCard);
  if (!isCorrect) attemptsLeft--;

  if (attemptsLeft <= 0 && !isCorrect) {
    showPopup("GAME OVER!", false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    playSound(soundGameOver);
    updateAttemptsDisplay();
    return;
  }

  showPopup(isCorrect ? "CORRECT!" : "TRY AGAIN!", isCorrect);
  if (isCorrect) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
  }
  isCorrect? playSound(soundCorrect) : playSound(soundIncorrect);
  updateAttemptsDisplay();
});

easterEgg.addEventListener('click', () => {
  showMiniGrid(1);
});

document.getElementById('prevBtn').addEventListener('click', () => {
  currentCard = currentCard === 1 ? 20 : currentCard - 1;
  updateCardDisplay();
});

document.getElementById('nextBtn').addEventListener('click', () => {
  currentCard = currentCard === 20 ? 1 : currentCard + 1;
  updateCardDisplay();
});

miniGrid.addEventListener('click', () => {
  showMiniGrid(0);
});

updateCardDisplay();
updateAttemptsDisplay();
