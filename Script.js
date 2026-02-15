const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");

let jumping = false;
let velocity = 0;
let gravity = 1.2;
let position = 0;

let score = 0;
let gameOver = false;

/* 🎵 Background Music */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playMusic() {
  const osc = audioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 220;
  osc.connect(audioCtx.destination);
  osc.start();
  setInterval(() => {
    osc.frequency.value = 200 + Math.random() * 100;
  }, 300);
}
playMusic();

/* 🏃 Jump */
function jump() {
  if (jumping || gameOver) return;
  jumping = true;
  velocity = 18;
}

function updatePlayer() {
  if (jumping) {
    position += velocity;
    velocity -= gravity;

    if (position <= 0) {
      position = 0;
      jumping = false;
    }

    player.style.bottom = position + "px";
  }
}

/* 🪨 Obstacles */
function createObstacle() {
  if (gameOver) return;

  const obs = document.createElement("div");
  obs.classList.add("obstacle");
  obs.textContent = "🪨";
  game.appendChild(obs);

  let obsX = 600;

  const moveObs = setInterval(() => {
    if (gameOver) {
      clearInterval(moveObs);
      obs.remove();
      return;
    }

    obsX -= 8;
    obs.style.right = (600 - obsX) + "px";

    if (obsX < 110 && obsX > 50 && position < 40) {
      endGame();
    }

    if (obsX < -50) {
      clearInterval(moveObs);
      obs.remove();
    }
  }, 30);

  setTimeout(createObstacle, Math.random() * 2000 + 1200);
}

/* 💰 Coins */
function createCoin() {
  if (gameOver) return;

  const coin = document.createElement("div");
  coin.classList.add("coin");
  coin.textContent = "💰";
  game.appendChild(coin);

  let coinX = 600;
  let coinY = Math.random() * 120 + 40;
  coin.style.bottom = coinY + "px";

  const moveCoin = setInterval(() => {
    if (gameOver) {
      clearInterval(moveCoin);
      coin.remove();
      return;
    }

    coinX -= 8;
    coin.style.right = (600 - coinX) + "px";

    // Coin collision
    if (coinX < 110 && coinX > 50 && Math.abs(position - coinY) < 40) {
      score += 5;
      coin.remove();
      clearInterval(moveCoin);
    }

    if (coinX < -50) {
      clearInterval(moveCoin);
      coin.remove();
    }
  }, 30);

  setTimeout(createCoin, Math.random() * 2000 + 1000);
}

/* 🎯 Score */
setInterval(() => {
  if (!gameOver) {
    score++;
    scoreEl.textContent = score;
  }
}, 200);

/* 💀 Game Over */
function endGame() {
  gameOver = true;
  alert("💀 You fell in the temple! Score: " + score);
}

/* ⌨️ Keyboard */
document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

/* 📱 Touch Controls */
document.addEventListener("touchstart", () => {
  jump();
});

/* 🔄 Loop */
function gameLoop() {
  updatePlayer();
  requestAnimationFrame(gameLoop);
}

gameLoop();
createObstacle();
createCoin();
