document.addEventListener('DOMContentLoaded', () => {
    const cartasBase = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
    
    // Capturamos los elementos del HTML
    const tablero = document.getElementById('tablero');
    const displayMovimientos = document.getElementById('movimientos');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnLobby = document.getElementById('btn-lobby'); // Nuevo botón capturado
    
    let cartas = []; 
    let cartaVolteada = false;
    let bloquearTablero = false;
    let primeraCarta, segundaCarta;
    let movimientos = 0;
    let parejasEncontradas = 0;

    function iniciarJuego() {
        tablero.innerHTML = '';
        movimientos = 0;
        parejasEncontradas = 0;
        displayMovimientos.textContent = movimientos;
        
        // Mezclamos las cartas
        cartas = cartasBase.sort(() => 0.5 - Math.random());

        cartas.forEach(valor => {
            const carta = document.createElement('div');
            carta.classList.add('carta');
            carta.dataset.valor = valor;

            carta.innerHTML = `
                <div class="cara cara-trasera">?</div>
                <div class="cara cara-frontal">${valor}</div>
            `;
            
            carta.addEventListener('click', voltearCarta);
            tablero.appendChild(carta);
        });
    }

    function voltearCarta() {
        if (bloquearTablero) return;
        if (this === primeraCarta) return;

        this.classList.add('flip');

        if (!cartaVolteada) {
            cartaVolteada = true;
            primeraCarta = this;
            return;
        }

        segundaCarta = this;
        incrementarMovimientos();
        verificarPareja();
    }

    function verificarPareja() {
        let esPareja = primeraCarta.dataset.valor === segundaCarta.dataset.valor;
        esPareja ? deshabilitarCartas() : desvoltearCartas();
    }

    function deshabilitarCartas() {
        primeraCarta.removeEventListener('click', voltearCarta);
        segundaCarta.removeEventListener('click', voltearCarta);
        
        parejasEncontradas++;
        resetearTablero();

        if(parejasEncontradas === (cartasBase.length / 2)) {
            setTimeout(() => alert(`¡Juego terminado! Movimientos: ${movimientos}`), 500);
        }
    }

    function desvoltearCartas() {
        bloquearTablero = true;
        
        setTimeout(() => {
            primeraCarta.classList.remove('flip');
            segundaCarta.classList.remove('flip');
            resetearTablero();
        }, 1000);
    }

    function resetearTablero() {
        [cartaVolteada, bloquearTablero] = [false, false];
        [primeraCarta, segundaCarta] = [null, null];
    }

    function incrementarMovimientos() {
        movimientos++;
        displayMovimientos.textContent = movimientos;
    }

    // Reiniciar el juego
    btnReiniciar.addEventListener('click', iniciarJuego);

    // Regresar al Lobby
    btnLobby.addEventListener('click', () => {
        // IMPORTANTE: Asegúrate de que tu archivo principal se llame 'index.html'
        // Si se llama 'lobby.html' o de otra forma, cambia el nombre aquí abajo.
        window.location.href = '/lobby.html';
    });

    iniciarJuego();
});