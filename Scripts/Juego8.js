document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES DE ESTADO ---
    let ultimoAgujero;
    let tiempoTerminado = false;
    let puntaje = 0;

    // --- ELEMENTOS HTML ---
    const agujeros = document.querySelectorAll('.agujero');
    const marcador = document.getElementById('score');
    const topos = document.querySelectorAll('.topo');
    const btnIniciar = document.getElementById('btn-iniciar');
    const btnLobby = document.getElementById('btn-lobby');

    // --- FUNCIONES AUXILIARES (HERRAMIENTAS) ---

    // 1. Generar un tiempo aleatorio (para saber cuánto tarda en esconderse el topo)
    function tiempoAleatorio(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    // 2. Elegir un agujero aleatorio
    function agujeroAleatorio(agujeros) {
        // Elegimos un índice al azar (del 0 al 5)
        const indice = Math.floor(Math.random() * agujeros.length);
        const agujero = agujeros[indice];

        // Evitamos que salga el mismo topo dos veces seguidas
        if (agujero === ultimoAgujero) {
            console.log('¡El mismo! Probando otro...');
            return agujeroAleatorio(agujeros);
        }
        
        ultimoAgujero = agujero;
        return agujero;
    }

    // --- LÓGICA DEL JUEGO ---

    // Esta función hace que un topo se asome
    function asomar() {
        const tiempo = tiempoAleatorio(500, 1500); // Entre 0.5 y 1.5 segundos
        const agujero = agujeroAleatorio(agujeros);
        
        // Buscamos el topo dentro de ese agujero y le ponemos la clase para subir
        const topo = agujero.querySelector('.topo');
        topo.classList.add('subir');

        // Programamos cuándo se va a esconder
        setTimeout(() => {
            topo.classList.remove('subir');
            
            // Si el tiempo del juego no ha terminado, sacamos otro topo
            if (!tiempoTerminado) {
                asomar();
            }
        }, tiempo);
    }

    function iniciarJuego() {
        // Reseteamos todo
        marcador.textContent = 0;
        tiempoTerminado = false;
        puntaje = 0;
        btnIniciar.disabled = true; // Desactivamos botón para no iniciarlo doble
        btnIniciar.textContent = "Jugando...";

        // Arrancamos el primer topo
        asomar();

        // El juego dura 10 segundos (10000 ms)
        setTimeout(() => {
            tiempoTerminado = true;
            btnIniciar.disabled = false;
            btnIniciar.textContent = "¡Jugar de nuevo!";
            alert('¡Tiempo fuera! Puntuación final: ' + puntaje);
        }, 10000);
    }

    function golpear(e) {
        // 'isTrusted' asegura que el clic fue real del usuario y no un script tramposo
        if(!e.isTrusted) return; 
        
        // Sumamos punto
        puntaje++;
        
        // Actualizamos pantalla
        this.parentNode.classList.remove('subir'); // Lo escondemos inmediatamente
        marcador.textContent = puntaje;
        
        // Efecto visual: hacemos que el topo se encoja un poco al golpearlo
        this.style.transform = "scale(0.8)";
        setTimeout(() => this.style.transform = "scale(1)", 100);
    }

    // --- EVENTOS ---

    // A cada topo le ponemos un "sensor" de golpes (clic)
    topos.forEach(topo => topo.addEventListener('click', golpear));

    btnIniciar.addEventListener('click', iniciarJuego);

    btnLobby.addEventListener('click', () => {
        window.location.href = '/Lobby.html';
    });
});