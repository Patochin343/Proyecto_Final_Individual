const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const setupScreen = document.getElementById('setupScreen');
const gameScreen = document.getElementById('gameScreen');

let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let currentPlayer = "X"; 
let userSymbol = "X";
let cpuSymbol = "O";
let mode = "pvc"; // pvc o pvp
let difficulty = "normal";
let cpuTimeout = null; // Variable para controlar el tiempo de espera de la CPU

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
    [0, 4, 8], [2, 4, 6]             // Diagonales
];

// --- Configuración y UI ---

function toggleDifficultyVisibility() {
    const modeVal = document.getElementById('gameMode').value;
    const diffGroup = document.getElementById('difficultyGroup');
    const turnGroup = document.getElementById('turnGroup');
    
    if(modeVal === 'pvp') {
        diffGroup.classList.add('hidden');
        turnGroup.classList.add('hidden');
    } else {
        diffGroup.classList.remove('hidden');
        turnGroup.classList.remove('hidden');
    }
}

function startGame() {
    mode = document.getElementById('gameMode').value;
    difficulty = document.getElementById('difficulty').value;
    userSymbol = document.getElementById('playerTurn').value;
    cpuSymbol = userSymbol === "X" ? "O" : "X";
    
    // Ocultar menú y mostrar juego
    setupScreen.style.display = 'none';
    gameScreen.style.display = 'flex'; // Usamos flex para que el CSS funcione bien
    
    resetBoard();
}

function resetBoard() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    statusText.innerText = "Turno de X";
    
    // Limpiar visualmente las celdas
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('x', 'o', 'winner');
    });

    // Si es Jugador vs CPU y el usuario eligió ser "O", la CPU (X) mueve primero
    if (mode === 'pvc' && userSymbol === 'O') {
        // Bloqueamos para que el usuario no pueda clicar antes
        gameActive = false; 
        cpuTimeout = setTimeout(cpuMove, 800);
    }
}

// --- Lógica del Juego ---

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) return;

    // Turno del Jugador
    makeMove(clickedCellIndex, currentPlayer);
    
    // Si el juego sigue y es contra la CPU
    if (mode === 'pvc' && gameActive) {
        gameActive = false; // Bloquear tablero mientras piensa CPU
        cpuTimeout = setTimeout(cpuMove, 600); // Pequeña pausa para realismo
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    const cell = document.querySelector(`.cell[data-index='${index}']`);
    cell.innerText = player;
    cell.classList.add(player.toLowerCase());

    if (checkWin()) {
        statusText.innerText = `¡Jugador ${player} gana!`;
        gameActive = false;
        highlightWinner();
        return;
    }

    if (!gameState.includes("")) {
        statusText.innerText = "¡Empate!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = `Turno de ${currentPlayer}`;
    
    // Devolver control al juego si es PvC y le toca al humano
    if(mode === 'pvc' && currentPlayer === userSymbol) {
        gameActive = true;
    }
    // En PvP siempre está activo
    if(mode === 'pvp') {
        gameActive = true;
    }
}

// --- Inteligencia Artificial ---

function cpuMove() {
    // Verificación extra por si salimos al lobby mientras esperaba
    if (setupScreen.style.display !== 'none') return; 

    let index;

    if (difficulty === "easy") {
        index = getRandomMove();
    } else if (difficulty === "normal") {
        index = Math.random() < 0.4 ? getRandomMove() : getBestMove();
    } else {
        index = getBestMove();
    }

    makeMove(index, cpuSymbol);
    
    // Si el juego no ha terminado, reactivamos para el jugador
    if(checkWin() || !gameState.includes("")) {
        gameActive = false;
    } else {
        gameActive = true; 
    }
}

function getRandomMove() {
    let available = [];
    gameState.forEach((cell, index) => {
        if (cell === "") available.push(index);
    });
    return available[Math.floor(Math.random() * available.length)];
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    
    for(let i=0; i<9; i++) {
        if(gameState[i] === "") {
            gameState[i] = cpuSymbol;
            let score = minimax(gameState, 0, false);
            gameState[i] = "";
            if(score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinnerForMinimax();
    if (result !== null) {
        if (result === cpuSymbol) return 10 - depth;
        if (result === userSymbol) return -10 + depth;
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = cpuSymbol;
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = userSymbol;
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinnerForMinimax() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return gameState[a];
        }
    }
    if (!gameState.includes("")) return "tie";
    return null;
}

// --- Utilidades ---

function checkWin() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return true;
        }
    }
    return false;
}

function highlightWinner() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            document.querySelector(`.cell[data-index='${a}']`).classList.add('winner');
            document.querySelector(`.cell[data-index='${b}']`).classList.add('winner');
            document.querySelector(`.cell[data-index='${c}']`).classList.add('winner');
        }
    }
}

// Inicializar UI correcta al cargar
toggleDifficultyVisibility();