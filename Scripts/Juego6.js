document.addEventListener('DOMContentLoaded', () => {
    
    let numeroSecreto = 0;
    let intentos = 0;
    let numerosProbados = []; // Aquí guardaremos la lista de números que ya dijiste
    let juegoTerminado = false;

    const inputNumero = document.getElementById('input-numero');
    const btnAdivinar = document.getElementById('btn-adivinar');
    const mensajePista = document.getElementById('mensaje-pista');
    const contadorIntentos = document.getElementById('contador-intentos');
    const historial = document.getElementById('historial');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnLobby = document.getElementById('btn-lobby');

    // FUNCIÓN PARA INICIAR O REINICIAR 
    function iniciarJuego() {
        // Generamos un número al azar entre 1 y 100
        // Math.random() da un número como 0.543, lo multiplicamos por 100 y le quitamos los decimales
        numeroSecreto = Math.floor(Math.random() * 100) + 1;
        
        intentos = 0;
        numerosProbados = [];
        juegoTerminado = false;

        // Limpiamos la pantalla
        inputNumero.value = '';
        inputNumero.disabled = false;
        inputNumero.focus(); // Ponemos el cursor en el input para escribir directo
        mensajePista.textContent = 'Escribe un número y pulsa Probar';
        mensajePista.className = 'mensaje'; // Quitamos colores de éxito/error
        actualizarInfo();
        
        console.log("Secreto (shh):", numeroSecreto); // Truco para ver el número en la consola (F12)
    }

    // LÓGICA DE ADIVINAR 
    function verificarNumero() {
        if (juegoTerminado) return;

        // Convertimos lo que escribió el usuario a un número entero
        const numeroUsuario = parseInt(inputNumero.value);

        // Validamos que sea un número válido
        if (isNaN(numeroUsuario) || numeroUsuario < 1 || numeroUsuario > 100) {
            mostrarMensaje("Por favor, introduce un número válido del 1 al 100.", "error");
            return;
        }

        // Aumentamos contador y guardamos historial
        intentos++;
        numerosProbados.push(numeroUsuario);
        actualizarInfo();

        // Comparamos los números
        if (numeroUsuario === numeroSecreto) {
            // ¡GANASTE!
            mostrarMensaje(`¡Correcto! El número era ${numeroSecreto}.`, "exito");
            juegoTerminado = true;
            inputNumero.disabled = true; // Bloqueamos para que no siga escribiendo
        } else if (numeroUsuario < numeroSecreto) {
            // El número es más grande
            mostrarMensaje("El número secreto es MAYOR ▲", "pista-normal");
            inputNumero.value = ''; // Borramos para que escriba el siguiente rápido
            inputNumero.focus();
        } else {
            // El número es más pequeño
            mostrarMensaje("El número secreto es MENOR ▼", "pista-normal");
            inputNumero.value = '';
            inputNumero.focus();
        }
    }

    // Función auxiliar para escribir mensajes y cambiarles el color
    function mostrarMensaje(texto, tipoClase) {
        mensajePista.textContent = texto;
        mensajePista.className = `mensaje ${tipoClase}`;
    }

    // Actualiza los textos de intentos e historial
    function actualizarInfo() {
        contadorIntentos.textContent = intentos;
        historial.textContent = numerosProbados.join(', ');
    }

    // EVENTOS (LISTENERS) 

    btnAdivinar.addEventListener('click', verificarNumero);

    // Permitir jugar presionando la tecla "Enter" en vez del botón
    inputNumero.addEventListener('keypress', (evento) => {
        if (evento.key === 'Enter') {
            verificarNumero();
        }
    });

    btnReiniciar.addEventListener('click', iniciarJuego);

    btnLobby.addEventListener('click', () => {
        window.location.href = '/Lobby.html';
    });

    // Arrancamos el juego
    iniciarJuego();
});