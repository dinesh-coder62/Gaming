let score = 0;
let timeLeft = 30;
let interval;
let highScore = localStorage.getItem("highScore") || 0;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

const scoreDisplay = document.getElementById("score");
const button = document.getElementById("clickButton");
const restartButton = document.getElementById("restartButton");

const timerDisplay = document.createElement("p");
timerDisplay.id = "timer";
timerDisplay.textContent = `Time left: ${timeLeft}s`;
document.querySelector(".game-container").appendChild(timerDisplay);

const highScoreDisplay = document.createElement("p");
highScoreDisplay.id = "highScore";
highScoreDisplay.textContent = `High Score: ${highScore}`;
document.querySelector(".game-container").appendChild(highScoreDisplay);

const difficultyLabel = document.createElement("label");
difficultyLabel.textContent = "Difficulty: ";
const difficultySelect = document.createElement("select");
const levels = ["Easy", "Medium", "Hard"];
levels.forEach(level => {
  const option = document.createElement("option");
  option.value = level.toLowerCase();
  option.textContent = level;
  difficultySelect.appendChild(option);
});
difficultyLabel.appendChild(difficultySelect);
document.querySelector(".game-container").appendChild(difficultyLabel);

const clickSound = new Audio("click.mp3");
const endSound = new Audio("end.mp3");

const leaderboardContainer = document.createElement("div");
leaderboardContainer.id = "leaderboard";
leaderboardContainer.innerHTML = "<h3>Leaderboard</h3><ul></ul>";
document.querySelector(".game-container").appendChild(leaderboardContainer);

const achievementsContainer = document.createElement("div");
achievementsContainer.id = "achievements";
achievementsContainer.innerHTML = "<h3>Achievements</h3><ul></ul>";
document.querySelector(".game-container").appendChild(achievementsContainer);

const statsDisplay = document.createElement("p");
statsDisplay.id = "stats";
statsDisplay.textContent = "Clicks per second: 0";
document.querySelector(".game-container").appendChild(statsDisplay);

let clickTimes = [];

function moveButton() {
  const container = document.querySelector(".game-container");
  const containerRect = container.getBoundingClientRect();
  const maxLeft = container.clientWidth - button.offsetWidth;
  const maxTop = container.clientHeight - button.offsetHeight;
  const left = Math.random() * maxLeft;
  const top = Math.random() * maxTop;
  button.style.position = "absolute";
  button.style.left = `${left}px`;
  button.style.top = `${top}px`;
}

function updateLeaderboard() {
  const ul = leaderboardContainer.querySelector("ul");
  ul.innerHTML = "";
  leaderboard.slice(0, 5).forEach(entry => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.src = entry.avatar || "default-avatar.png";
    img.alt = `${entry.name}'s avatar`;
    img.width = 24;
    img.height = 24;
    img.style.marginRight = "8px";
    li.appendChild(img);
    li.appendChild(document.createTextNode(`${entry.name}: ${entry.score}`));
    ul.appendChild(li);
  });
}

function updateAchievements() {
  const ul = achievementsContainer.querySelector("ul");
  ul.innerHTML = "";
  const achievementList = [];
  if (score >= 10) achievementList.push("Quick Starter: 10 points");
  if (score >= 25) achievementList.push("Pro Clicker: 25 points");
  if (score >= 50) achievementList.push("Master Clicker: 50 points");
  achievementList.forEach(ach => {
    const li = document.createElement("li");
    li.textContent = ach;
    ul.appendChild(li);
  });
}

function updateStats() {
  const now = Date.now();
  clickTimes = clickTimes.filter(t => now - t < 1000);
  statsDisplay.textContent = `Clicks per second: ${clickTimes.length}`;
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = `Time left: ${timeLeft}s`;
  if (timeLeft <= 0) {
    clearInterval(interval);
    button.disabled = true;
    endSound.play();
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreDisplay.textContent = `High Score: ${highScore}`;
    }

    const name = prompt("Enter your name for the leaderboard:", "Player");
    let avatar = prompt("Enter URL of your avatar image (or leave blank for default):", "");
    avatar = avatar || "default-avatar.png";
    if (name) {
      leaderboard.push({ name, score, avatar });
      leaderboard.sort((a, b) => b.score - a.score);
      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
      updateLeaderboard();
    }
  }
}

function startGame() {
  button.disabled = false;
  score = 0;
  clickTimes = [];
  const difficulty = difficultySelect.value;
  timeLeft = difficulty === "easy" ? 40 : difficulty === "medium" ? 30 : 20;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = `Time left: ${timeLeft}s`;
  clearInterval(interval);
  interval = setInterval(updateTimer, 1000);
}

button.addEventListener("click", () => {
  score++;
  scoreDisplay.textContent = score;
  clickTimes.push(Date.now());
  updateStats();
  clickSound.play();
  updateAchievements();
  moveButton();
});

restartButton.addEventListener("click", startGame);

difficultySelect.addEventListener("change", () => {
  startGame();
});

// Start game on page load
updateLeaderboard();
startGame();
