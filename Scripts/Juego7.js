document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES DE ESTADO ---
    let puntajeUsuario = 0;
    let puntajeCpu = 0;

    // --- ELEMENTOS DEL HTML ---
    const displayUsuario = document.getElementById('puntos-usuario');
    const displayCpu = document.getElementById('puntos-cpu');
    
    const displayEleccionUsuario = document.getElementById('eleccion-usuario');
    const displayEleccionCpu = document.getElementById('eleccion-cpu');
    const mensajeResultado = document.getElementById('mensaje-resultado');

    // Botones
    const btnPiedra = document.getElementById('piedra');
    const btnPapel = document.getElementById('papel');
    const btnTijera = document.getElementById('tijera');
    
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnLobby = document.getElementById('btn-lobby');

    // Diccionario para convertir texto en emoji
    const emojis = {
        'piedra': '🪨',
        'papel': '📄',
        'tijera': '✂️'
    };

    // --- FUNCIÓN PRINCIPAL DEL JUEGO ---
    function jugar(eleccionUsuario) {
        // 1. La computadora elige al azar
        const opciones = ['piedra', 'papel', 'tijera'];
        const numeroRandom = Math.floor(Math.random() * 3); // Genera 0, 1 o 2
        const eleccionCpu = opciones[numeroRandom];

        // 2. Mostramos en pantalla qué eligió cada uno
        actualizarBatallaVisual(eleccionUsuario, eleccionCpu);

        // 3. Decidimos quién ganó
        if (eleccionUsuario === eleccionCpu) {
            empatar(eleccionUsuario, eleccionCpu);
        } 
        else if (
            (eleccionUsuario === 'piedra' && eleccionCpu === 'tijera') ||
            (eleccionUsuario === 'papel' && eleccionCpu === 'piedra') ||
            (eleccionUsuario === 'tijera' && eleccionCpu === 'papel')
        ) {
            ganar(eleccionUsuario, eleccionCpu);
        } 
        else {
            perder(eleccionUsuario, eleccionCpu);
        }
    }

    // --- FUNCIONES DE RESULTADO ---

    function ganar(user, cpu) {
        puntajeUsuario++; // Sumamos punto
        displayUsuario.innerText = puntajeUsuario;
        
        mensajeResultado.style.color = '#2ecc71'; // Verde
        mensajeResultado.innerText = `¡Ganaste! ${user} vence a ${cpu}.`;
        
        // Efecto visual en los emojis
        displayEleccionUsuario.classList.add('ganador-borde');
    }

    function perder(user, cpu) {
        puntajeCpu++;
        displayCpu.innerText = puntajeCpu;

        mensajeResultado.style.color = '#e74c3c'; // Rojo
        mensajeResultado.innerText = `¡Perdiste! ${cpu} vence a ${user}.`;
        
        displayEleccionCpu.classList.add('ganador-borde'); // Resaltamos al CPU porque ganó
    }

    function empatar(user, cpu) {
        mensajeResultado.style.color = 'white';
        mensajeResultado.innerText = "¡Es un empate!";
    }

    // --- ACTUALIZAR LA ZONA VISUAL ---
    function actualizarBatallaVisual(user, cpu) {
        // Limpiamos efectos anteriores
        displayEleccionUsuario.classList.remove('ganador-borde');
        displayEleccionCpu.classList.remove('ganador-borde');

        // Ponemos los emojis grandes
        displayEleccionUsuario.innerText = emojis[user];
        displayEleccionCpu.innerText = emojis[cpu];
    }

    // --- EVENTOS DE CLIC ---
    
    // Asignamos la función jugar a cada botón con su opción correspondiente
    btnPiedra.addEventListener('click', () => jugar('piedra'));
    btnPapel.addEventListener('click', () => jugar('papel'));
    btnTijera.addEventListener('click', () => jugar('tijera'));

    // Botón para resetear todo a cero
    btnReiniciar.addEventListener('click', () => {
        puntajeUsuario = 0;
        puntajeCpu = 0;
        displayUsuario.innerText = '0';
        displayCpu.innerText = '0';
        mensajeResultado.innerText = '¡Elige tu arma!';
        mensajeResultado.style.color = 'white';
        displayEleccionUsuario.innerText = '❔';
        displayEleccionCpu.innerText = '❔';
        
        // Quitamos clases de efectos
        displayEleccionUsuario.classList.remove('ganador-borde');
        displayEleccionCpu.classList.remove('ganador-borde');
    });

    // Botón para irse
    btnLobby.addEventListener('click', () => {
        window.location.href = '/Lobby.html';
    });
});