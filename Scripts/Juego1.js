const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // Contexto de dibujo
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

// Configuración del juego
const box = 20; // Tamaño de cada cuadrito (grid)
const canvasSize = 400; // Tamaño del canvas
// Calculamos cuántas filas/columnas caben (400 / 20 = 20 espacios)

let snake = [];
let food = {};
let score = 0;
let d; // Dirección
let game; // Variable para el intervalo del juego

// Sonidos (opcional, dejamos la estructura lista)
// const eatSound = new Audio('eat.mp3');

// 1. Inicializar el juego
function initGame() {
    // Posición inicial de la serpiente
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box }; // Cabeza en el centro

    // Crear primera comida
    createFood();

    score = 0;
    scoreElement.innerText = score;
    d = null; // Esperamos a que el usuario presione una tecla

    // Limpiamos intervalos previos si reiniciamos
    clearInterval(game);
    
    // Inicia el bucle del juego (100ms = velocidad)
    game = setInterval(draw, 100);
    
    startBtn.style.display = "none"; // Ocultar botón al jugar
}

// 2. Crear comida en posición aleatoria
function createFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize/box)) * box,
        y: Math.floor(Math.random() * (canvasSize/box)) * box
    };
}

// 3. Escuchar el teclado
document.addEventListener('keydown', direction);

function direction(event) {
    let key = event.keyCode;
    // Códigos: 37=Izq, 38=Arr, 39=Der, 40=Abj
    // Evitamos que la serpiente regrese sobre sí misma (ej: ir derecha estando en izquierda)
    if(key == 37 && d != "RIGHT") d = "LEFT";
    else if(key == 38 && d != "DOWN") d = "UP";
    else if(key == 39 && d != "LEFT") d = "RIGHT";
    else if(key == 40 && d != "UP") d = "DOWN";
}

// 4. Función principal de dibujado (se ejecuta cada 100ms)
function draw() {
    // Limpiar canvas (fondo negro)
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Dibujar Serpiente
    for(let i = 0; i < snake.length; i++) {
        // Cabeza verde, cuerpo verde más oscuro
        ctx.fillStyle = (i == 0) ? "#00ff55" : "#00aa33";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        
        // Borde negro para distinguir segmentos
        ctx.strokeStyle = "#000";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Dibujar Comida (Rojo)
    ctx.fillStyle = "#ff0055";
    ctx.fillRect(food.x, food.y, box, box);

    // Posición actual de la cabeza
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Mover coordenadas según dirección
    if(d == "LEFT") snakeX -= box;
    if(d == "UP") snakeY -= box;
    if(d == "RIGHT") snakeX += box;
    if(d == "DOWN") snakeY += box;

    // Detectar si comió
    if(snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerText = score;
        createFood();
        // No quitamos la cola (snake.pop), así que crece
    } else {
        // Si no comió, quitamos la cola para mantener el tamaño mientras se mueve
        snake.pop();
    }

    // Nueva cabeza
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Detectar Game Over
    if(snakeX < 0 || snakeX >= canvasSize || snakeY < 0 || snakeY >= canvasSize || collision(newHead, snake)) {
        clearInterval(game);
        alert("GAME OVER! Tu puntuación: " + score);
        startBtn.style.display = "inline-block";
        startBtn.innerText = "REINTENTAR";
        return; // Salimos de la función
    }

    // Añadir nueva cabeza al inicio del array
    snake.unshift(newHead);
}

// Verificar colisión con el propio cuerpo
function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// Iniciar al hacer click
startBtn.addEventListener('click', initGame);