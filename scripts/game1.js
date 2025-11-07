// Espera a que cargue el contenido
document.addEventListener('DOMContentLoaded', () => {

    // Obtener los elementos del DOM
    const rockBtn = document.getElementById('rock');
    const paperBtn = document.getElementById('paper');
    const scissorsBtn = document.getElementById('scissors');
    
    const playerChoiceSpan = document.getElementById('player-choice');
    const computerChoiceSpan = document.getElementById('computer-choice');
    const resultText = document.getElementById('result-text');
    
    const playerScoreSpan = document.getElementById('player-score');
    const computerScoreSpan = document.getElementById('computer-score');

    let playerScore = 0;
    let computerScore = 0;
    const choices = ['🪨', '📄', '✂️']; // 0: Piedra, 1: Papel, 2: Tijera

    // Añadir eventos a los botones
    rockBtn.addEventListener('click', () => playGame('🪨'));
    paperBtn.addEventListener('click', () => playGame('📄'));
    scissorsBtn.addEventListener('click', () => playGame('✂️'));

    function playGame(playerChoice) {
        // 1. Obtener la elección de la IA
        const computerIndex = Math.floor(Math.random() * 3);
        const computerChoice = choices[computerIndex];

        // 2. Mostrar elecciones
        playerChoiceSpan.textContent = playerChoice;
        computerChoiceSpan.textContent = computerChoice;

        // 3. Determinar el ganador
        if (playerChoice === computerChoice) {
            // Empate
            resultText.textContent = '¡Es un Empate!';
        } else if (
            (playerChoice === '🪨' && computerChoice === '✂️') ||
            (playerChoice === '📄' && computerChoice === '🪨') ||
            (playerChoice === '✂️' && computerChoice === '📄')
        ) {
            // Jugador gana
            resultText.textContent = '¡Ganaste!';
            playerScore++;
            playerScoreSpan.textContent = playerScore;
        } else {
            // IA gana
            resultText.textContent = '¡Perdiste!';
            computerScore++;
            computerScoreSpan.textContent = computerScore;
        }
    }
});