const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Elementos del DOM
const menuOverlay = document.getElementById('menuOverlay');
const pauseOverlay = document.getElementById('pauseOverlay');
const mainContainer = document.getElementById('mainContainer');
const goodbyeScreen = document.getElementById('goodbyeScreen');

// CORRECCIÓN AQUÍ: Usamos getElementById para asegurar que encuentre el marcador
const p1ScoreEl = document.getElementById('player1Score');
const p2ScoreEl = document.getElementById('player2Score');

const difficultyGroup = document.getElementById('difficultyGroup');
const gameModeSelect = document.getElementById('gameMode');

// --- Variables del Juego ---
let gameRunning = false;
let isPaused = false;
let animationId;
let mode = 'pvc'; 
let difficulty = 'normal';

// Configuración visual
const paddleWidth = 12;
const paddleHeight = 80;
const ballSize = 8; 

const player1 = {
    x: 15,
    y: canvas.height / 2 - paddleHeight / 2,
    score: 0,
    color: '#4facfe', // Azul
    speed: 7
};

const player2 = {
    x: canvas.width - 27,
    y: canvas.height / 2 - paddleHeight / 2,
    score: 0,
    color: '#f093fb', // Rosa
    speed: 7 
};

// Configuración Pelota (Velocidad controlada)
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 4, 
    dy: 4, 
    speed: 4 
};

// Control de Teclas
const keysPressed = {};

document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
    if (e.code === 'Space' && gameRunning) togglePause();
});

document.addEventListener('keyup', (e) => keysPressed[e.key] = false);

// Evento para ocultar dificultad en PvP
gameModeSelect.addEventListener('change', () => {
    if(gameModeSelect.value === 'pvp') {
        difficultyGroup.style.display = 'none';
    } else {
        difficultyGroup.style.display = 'block';
    }
});

// --- Funciones del Sistema ---

function startGame() {
    mode = gameModeSelect.value;
    difficulty = document.getElementById('difficulty').value;
    
    // Reiniciar valores
    player1.score = 0;
    player2.score = 0;
    updateScoreBoard();
    resetBall();
    
    // Ocultar menús
    menuOverlay.classList.add('hidden');
    pauseOverlay.classList.add('hidden');
    
    gameRunning = true;
    isPaused = false;
    
    cancelAnimationFrame(animationId);
    gameLoop();
}

// NUEVA FUNCIÓN DE SALIDA
function exitGame() {
    gameRunning = false;
    // Ocultar el contenedor del juego
    mainContainer.style.display = 'none';
    // Mostrar pantalla de despedida
    window.location.href = '/Lobby.html';
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseOverlay.classList.remove('hidden');
        document.getElementById('pauseTitle').innerText = "PAUSA";
    } else {
        pauseOverlay.classList.add('hidden');
        gameLoop();
    }
}

function resumeGame() {
    togglePause();
}

function resetGame() {
    gameRunning = false;
    isPaused = false;
    cancelAnimationFrame(animationId);
    pauseOverlay.classList.add('hidden');
    menuOverlay.classList.remove('hidden');
}

// --- Bucle del Juego ---

function gameLoop() {
    if (!gameRunning || isPaused) return;
    update();
    draw();
    animationId = requestAnimationFrame(gameLoop);
}

function update() {
    // Movimiento P1
    if (keysPressed['w'] || keysPressed['W']) player1.y -= player1.speed;
    if (keysPressed['s'] || keysPressed['S']) player1.y += player1.speed;

    // Movimiento P2
    if (mode === 'pvp') {
        if (keysPressed['ArrowUp']) player2.y -= player2.speed;
        if (keysPressed['ArrowDown']) player2.y += player2.speed;
    } else {
        moveCPU();
    }

    // Límites de pantalla
    player1.y = Math.max(0, Math.min(canvas.height - paddleHeight, player1.y));
    player2.y = Math.max(0, Math.min(canvas.height - paddleHeight, player2.y));

    // Bola
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Rebote Paredes
    if (ball.y + ballSize > canvas.height || ball.y < 0) ball.dy *= -1;

    // Colisiones Paletas
    if (
        ball.x < player1.x + paddleWidth &&
        ball.y > player1.y &&
        ball.y < player1.y + paddleHeight
    ) {
        ball.dx = Math.abs(ball.dx);
        increaseSpeed();
    }

    if (
        ball.x > player2.x - ballSize &&
        ball.y > player2.y &&
        ball.y < player2.y + paddleHeight
    ) {
        ball.dx = -Math.abs(ball.dx);
        increaseSpeed();
    }

    // Goles
    if (ball.x < 0) {
        player2.score++;
        checkWin();
        resetBall();
    } else if (ball.x > canvas.width) {
        player1.score++;
        checkWin();
        resetBall();
    }
    
    // IMPORTANTE: Actualizar marcador en cada gol
    updateScoreBoard(); 
}

function moveCPU() {
    let speed;
    let errorChance = 0;

    if (difficulty === 'easy') {
        speed = 3;
        errorChance = 0.3; 
    } else if (difficulty === 'normal') {
        speed = 5;
        errorChance = 0.1;
    } else { 
        speed = 8;
        errorChance = 0.0;
    }

    const paddleCenter = player2.y + paddleHeight / 2;
    if (Math.random() < errorChance) return;

    if (paddleCenter < ball.y - 10) {
        player2.y += speed;
    } else if (paddleCenter > ball.y + 10) {
        player2.y -= speed;
    }
}

function increaseSpeed() {
    if (Math.abs(ball.dx) < 12) {
        ball.dx *= 1.05; 
        ball.dy *= 1.05;
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    const dirX = Math.random() > 0.5 ? 1 : -1;
    const dirY = Math.random() > 0.5 ? 1 : -1;
    ball.dx = ball.speed * dirX;
    ball.dy = ball.speed * dirY;
}

function checkWin() {
    if (player1.score >= 5 || player2.score >= 5) {
        isPaused = true;
        pauseOverlay.classList.remove('hidden');
        const winner = player1.score >= 5 ? "JUGADOR 1" : (mode === 'pvc' ? "CPU" : "JUGADOR 2");
        document.getElementById('pauseTitle').innerText = `¡${winner} GANA!`;
    }
}

function updateScoreBoard() {
    // Ahora usamos las variables definidas con getElementById
    p1ScoreEl.innerText = player1.score;
    p2ScoreEl.innerText = player2.score;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Red
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paletas y Bola
    drawRect(player1.x, player1.y, paddleWidth, paddleHeight, player1.color);
    drawRect(player2.x, player2.y, paddleWidth, paddleHeight, player2.color);
    drawCircle(ball.x, ball.y, ballSize, '#fff');
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.fillRect(x, y, w, h);
    ctx.shadowBlur = 0;
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.shadowBlur = 0;
}