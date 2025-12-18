document.addEventListener('DOMContentLoaded', () => {

    // --- LISTA DE PALABRAS ---
    // Puedes añadir las que quieras aquí
    const bancoPalabras = [
        "JAVASCRIPT", "PROGRAMACION", "COMPUTADORA", "INTERNET", "DESARROLLO",
        "TECLADO", "PANTALLA", "CODIGO", "VARIABLE", "FUNCION", "ARCHIVO",
        "NAVEGADOR", "SISTEMA", "SERVIDOR", "ALGORITMO", "MEMORIA"
    ];

    // --- VARIABLES DE ESTADO ---
    let palabraSecreta = "";
    let letrasAdivinadas = []; // Guardamos qué letras ha acertado
    let errores = 0;
    let maxErrores = 6; // Cabeza, cuerpo, brazo I, brazo D, pierna I, pierna D

    // --- ELEMENTOS DEL HTML ---
    const contenedorPalabra = document.getElementById('palabra-oculta');
    const contenedorTeclado = document.getElementById('teclado');
    const mensajeEstado = document.getElementById('mensaje-estado');
    const partesCuerpo = document.querySelectorAll('.parte-cuerpo');
    
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnLobby = document.getElementById('btn-lobby');

    // --- FUNCIÓN PRINCIPAL: INICIAR PARTIDA ---
    function iniciarJuego() {
        // 1. Resetear variables
        errores = 0;
        letrasAdivinadas = [];
        mensajeEstado.innerText = "";
        mensajeEstado.style.color = "white";

        // 2. Ocultar todas las partes del cuerpo (reiniciar dibujo)
        partesCuerpo.forEach(parte => parte.style.display = 'none');

        // 3. Elegir palabra aleatoria
        const indice = Math.floor(Math.random() * bancoPalabras.length);
        palabraSecreta = bancoPalabras[indice];

        // 4. Dibujar la interfaz
        mostrarPalabraEnPantalla();
        generarTeclado();
        
        console.log("Palabra (shh):", palabraSecreta);
    }

    // --- DIBUJAR LOS GUIONES Y LETRAS ---
    function mostrarPalabraEnPantalla() {
        // Convertimos la palabra en un array de caracteres y la mapeamos
        // Si la letra ya fue adivinada, la mostramos. Si no, ponemos un guión.
        const htmlPalabra = palabraSecreta
            .split('')
            .map(letra => letrasAdivinadas.includes(letra) ? letra : '_')
            .join(' ');

        contenedorPalabra.innerText = htmlPalabra;

        // Verificar victoria: Si ya no hay guiones bajos, ganaste
        if (!htmlPalabra.includes('_')) {
            finalizarJuego(true);
        }
    }

    // --- CREAR BOTONES A-Z ---
    function generarTeclado() {
        contenedorTeclado.innerHTML = ''; // Limpiar teclado anterior
        
        // Generamos letras de la A a la Z usando códigos ASCII (65-90)
        for (let i = 65; i <= 90; i++) {
            const letra = String.fromCharCode(i);
            
            const boton = document.createElement('button');
            boton.innerText = letra;
            boton.classList.add('tecla');
            
            // Al hacer clic, comprobamos la letra
            boton.addEventListener('click', () => manejarIntento(letra, boton));
            
            contenedorTeclado.appendChild(boton);
        }
    }

    // --- LÓGICA AL ELEGIR LETRA ---
    function manejarIntento(letra, boton) {
        // Deshabilitamos el botón para que no se pueda pulsar dos veces
        boton.disabled = true;

        if (palabraSecreta.includes(letra)) {
            // ACIERTO: Guardamos la letra y refrescamos la pantalla
            letrasAdivinadas.push(letra);
            mostrarPalabraEnPantalla();
        } else {
            // ERROR: Aumentamos error y dibujamos una parte
            errores++;
            dibujarAhorcado();
            
            if (errores >= maxErrores) {
                finalizarJuego(false);
            }
        }
    }

    // --- DIBUJAR PARTE DEL CUERPO ---
    function dibujarAhorcado() {
        // Los IDs son "parte-0", "parte-1", etc.
        // Como 'errores' empieza en 1, restamos 1 para obtener el índice 0
        const idParte = `parte-${errores - 1}`;
        const elemento = document.getElementById(idParte);
        
        if (elemento) {
            elemento.style.display = 'block'; // Hacemos visible la línea SVG
        }
    }

    // --- FIN DEL JUEGO ---
    function finalizarJuego(victoria) {
        // Deshabilitar todo el teclado
        const botones = document.querySelectorAll('.tecla');
        botones.forEach(btn => btn.disabled = true);

        if (victoria) {
            mensajeEstado.innerText = "¡Felicidades! Has adivinado la palabra.";
            mensajeEstado.style.color = "#2ecc71"; // Verde
        } else {
            mensajeEstado.innerText = `¡Perdiste! La palabra era: ${palabraSecreta}`;
            mensajeEstado.style.color = "#e74c3c"; // Rojo
            // Mostramos la palabra completa
            contenedorPalabra.innerText = palabraSecreta.split('').join(' ');
        }
    }

    // --- SOPORTE PARA TECLADO FÍSICO ---
    document.addEventListener('keydown', (evento) => {
        // Solo aceptamos letras de la A a la Z
        const letra = evento.key.toUpperCase();
        if (letra >= 'A' && letra <= 'Z' && letra.length === 1) {
            // Buscamos el botón correspondiente en la pantalla
            // Array.from convierte la lista de botones en un array real para poder usar .find
            const botones = Array.from(document.querySelectorAll('.tecla'));
            const botonCorrespondiente = botones.find(btn => btn.innerText === letra);

            // Si el botón existe y no está deshabilitado, hacemos clic
            if (botonCorrespondiente && !botonCorrespondiente.disabled) {
                botonCorrespondiente.click();
            }
        }
    });

    // --- EVENTOS DE BOTONES DE CONTROL ---
    btnReiniciar.addEventListener('click', iniciarJuego);

    btnLobby.addEventListener('click', () => {
        window.location.href = '/Lobby.html';
    });

    // Arrancamos
    iniciarJuego();
});