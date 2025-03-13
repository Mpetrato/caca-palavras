const words = ["acidente", "alerta", "comunicação", "conscientização", "emergência", "epis", "equipamento", "ferramenta", "manutenção", "material", "máquina", "perigo", "prevenção", "proteção", "regulamentos", "risco", "saúde", "segurança", "seguro", "sinal", "trabalho"]
const gridSize = 20;

let time = 0;
let intervalId = null;
let started = false;

let selecting = false;
let selectedCells = [];
let selectedWord = "";

const grid = document.getElementById("grid");
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let gridArray = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));

function placeWord(word) {
  let placed = false;

  while (!placed) {
    const isHorizontal = Math.random() > 0.5;
    let row, col;

    if (isHorizontal) {
      row = Math.floor(Math.random() * gridSize);
      col = Math.floor(Math.random() * (gridSize - word.length + 1));
    } else {
      row = Math.floor(Math.random() * (gridSize - word.length + 1));
      col = Math.floor(Math.random() * gridSize);
    }

    if (isHorizontal) {
      if (gridArray[row].slice(col, col + word.length).every(cell => cell === null)) {
        for (let i = 0; i < word.length; i++) {
          gridArray[row][col + i] = word[i];
        }
        placed = true;
      }
    } else {
      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        if (gridArray[row + i][col] !== null) {
          canPlace = false;
          break;
        }
      }
      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          gridArray[row + i][col] = word[i];
        }
        placed = true;
      }
    }
  }
}

function fillGrid() {
    words.forEach(placeWord);
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
          if (!gridArray[row][col]) {
              gridArray[row][col] = letters[Math.floor(Math.random() * letters.length)];
          }
      }
    }
}

function createGrid() {
  fillGrid();

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = String(gridArray[row][col]).toUpperCase();
      cell.dataset.index = `${row}-${col}`;
      grid.appendChild(cell);
    }
  }
}

function startSelection(e) {
    selecting = true;
    selectedCells = [e.target];
    selectedWord = e.target.textContent;
    e.target.classList.add("selected");
}

function continueSelection(e) {
    if (!selecting) return;
    selectedCells.push(e.target);
    selectedWord += e.target.textContent;
    e.target.classList.add("selected");
}

function endSelection() {
    selecting = false;
    if (words.includes(selectedWord.toLowerCase())) {
      selectedCells.forEach(cell => cell.classList.add("found"));

      const wordList = document.querySelectorAll(".word")
      wordList.forEach((value) => {
        if (String(value.innerText).toLowerCase() === selectedWord.toLowerCase()) {
          value.classList.add("active")
        }
      })

      document.querySelectorAll(".word-list li").forEach(item => {
        if (item.textContent === selectedWord) {
          item.style.textDecoration = "line-through";
        }
      });
    }

    selectedCells.forEach(cell => cell.classList.remove("selected"));
    selectedCells = [];
    selectedWord = "";
}

function createWords() {
  const wordsWrapper = document.querySelector("#words")
  console.log(words)

  words.forEach((word) => {
    const newWord = document.createElement("li")
    newWord.innerText = word
    newWord.classList.add("word")
    wordsWrapper.appendChild(newWord)
  })
}

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("Tempo total:", formatTime(time));
  }
}

function startGame() {
  const startButton = document.querySelector(".header-right-wrapper-box-button")
  if (startButton) {
    startButton.addEventListener("click", () => {
      if (intervalId) return
      started = true
  
      startButton.classList.add("time")
      startButton.innerText = formatTime(time)
      
       intervalId = setInterval(() => {
        time += 1;
        startButton.innerText = formatTime(time)
      }, 1000);
      const cells = document.querySelectorAll(".cell")
      cells.forEach((cell) => {
        cell.addEventListener("mousedown", startSelection);
        cell.addEventListener("mouseenter", continueSelection);
        cell.addEventListener("mouseup", endSelection);
      })
    })
  }
}


document.addEventListener("mouseup", () => selecting = false);
createGrid();
createWords();
startGame();