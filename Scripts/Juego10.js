document.addEventListener('DOMContentLoaded', () => {
    
    // Primero agarramos todos los elementos del HTML que vamos a usar
    const canvas = document.getElementById('canvas-juego');
    const ctx = canvas.getContext('2d'); // Esto es nuestro pincel virtual
    
    const displayPuntos = document.getElementById('score');
    const displayNivel = document.getElementById('nivel');
    const mensajeEstado = document.getElementById('mensaje-estado');
    const btnIniciar = document.getElementById('btn-iniciar');
    const btnLobby = document.getElementById('btn-lobby');

    // Variables para controlar qué está pasando en el juego
    let juegoActivo = false;
    let animacionId; // Para poder pausar o parar el bucle luego
    let puntuacion = 0;
    let nivel = 1;

    // Configuramos al Jugador (nuestra navecita)
    const jugador = {
        x: canvas.width / 2 - 15, // Empieza en el centro
        y: canvas.height - 30,    // Pegado al suelo
        ancho: 30,
        alto: 20,
        velocidad: 5,
        dx: 0, // dx es "cuánto me muevo en X", si es 0 estoy quieto
        color: '#00ff00'
    };

    // Aquí guardaremos las balas que disparemos
    let balas = [];
    const velocidadBala = 7;

    // Y aquí guardaremos el ejército de aliens
    let aliens = [];
    
    // Configuración de la horda alienígena
    const filasAliens = 4;
    const columnasAliens = 8;
    const alienAncho = 30;
    const alienAlto = 20;
    const alienPadding = 10; // Espacio entre ellos
    const alienOffsetTop = 30; // Margen superior
    const alienOffsetLeft = 30; // Margen izquierdo
    
    // Cómo se mueven los aliens
    let alienDx = 1; // Velocidad lateral
    let alienDy = 10; // Cuánto bajan cuando tocan la pared

    // Escuchamos el teclado para movernos
    document.addEventListener('keydown', teclaPresionada);
    document.addEventListener('keyup', teclaSoltada);

    function teclaPresionada(e) {
        if (!juegoActivo) return; // Si el juego no empezó, ignoramos las teclas

        // Si tocas flecha derecha o izquierda, cambiamos la velocidad
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            jugador.dx = jugador.velocidad;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            jugador.dx = -jugador.velocidad;
        } else if (e.key === ' ' || e.code === 'Space') {
            disparar(); // ¡Pium pium!
        }
    }

    function teclaSoltada(e) {
        if (!juegoActivo) return;

        // Si sueltas la tecla, la nave se frena (dx vuelve a 0)
        if (
            e.key === 'Right' || e.key === 'ArrowRight' || 
            e.key === 'Left' || e.key === 'ArrowLeft'
        ) {
            jugador.dx = 0;
        }
    }

    // Función para arrancar todo desde cero
    function iniciarJuego() {
        if (juegoActivo) return;

        juegoActivo = true;
        puntuacion = 0;
        nivel = 1;
        balas = [];
        alienDx = 1; // Empiezan lentos
        
        displayPuntos.innerText = puntuacion;
        displayNivel.innerText = nivel;
        mensajeEstado.style.visibility = 'hidden';
        btnIniciar.disabled = true;
        btnIniciar.innerText = "Jugando...";

        // Creamos la primera oleada y arrancamos el motor
        crearAliens();
        gameLoop();
    }

    // Llenamos el array de aliens calculando su posición en la rejilla
    function crearAliens() {
        aliens = [];
        for (let c = 0; c < columnasAliens; c++) {
            for (let f = 0; f < filasAliens; f++) {
                let alienX = (c * (alienAncho + alienPadding)) + alienOffsetLeft;
                let alienY = (f * (alienAlto + alienPadding)) + alienOffsetTop;
                // "vivo: true" es clave para saber si lo dibujamos o no
                aliens.push({ x: alienX, y: alienY, vivo: true });
            }
        }
    }

    function disparar() {
        // Truco: limitamos las balas a 3 para que no sea tan fácil
        if (balas.length < 3) {
            balas.push({
                x: jugador.x + jugador.ancho / 2 - 2, // Sale del centro de la nave
                y: jugador.y,
                ancho: 4,
                alto: 10
            });
        }
    }

    // El corazón del juego: esto se ejecuta unas 60 veces por segundo
    function gameLoop() {
        if (!juegoActivo) return;

        // 1. Borramos todo lo que había en el cuadro anterior
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 2. Dibujamos todo en su nueva posición
        dibujarJugador();
        dibujarBalas();
        dibujarAliens();
        
        // 3. Calculamos las nuevas posiciones
        moverJugador();
        moverBalas();
        moverAliens();
        
        // 4. Verificamos choques y reglas
        detectarColisiones();
        verificarNivel();

        // 5. Pedimos al navegador que repita esto en el siguiente frame
        animacionId = requestAnimationFrame(gameLoop);
    }

    // Función simple para dibujar la navecita verde
    function dibujarJugador() {
        ctx.fillStyle = jugador.color;
        // Hago una forma escalonada simple con dos rectángulos
        ctx.fillRect(jugador.x, jugador.y + 10, jugador.ancho, 10); // Base
        ctx.fillRect(jugador.x + 10, jugador.y, 10, 10); // Cañoncito
    }

    function dibujarBalas() {
        ctx.fillStyle = '#ffff00'; // Amarillo láser
        balas.forEach(bala => {
            ctx.fillRect(bala.x, bala.y, bala.ancho, bala.alto);
        });
    }

    function dibujarAliens() {
        ctx.fillStyle = '#ff0055'; // Rojo alienígena
        aliens.forEach(alien => {
            if (alien.vivo) {
                // Dibujo el cuerpo principal
                ctx.fillRect(alien.x, alien.y, alienAncho, alienAlto);
                // Le pinto unos ojitos negros para darle personalidad
                ctx.fillStyle = 'black';
                ctx.fillRect(alien.x + 5, alien.y + 5, 5, 5);
                ctx.fillRect(alien.x + 20, alien.y + 5, 5, 5);
                // Vuelvo al color rojo para el siguiente alien
                ctx.fillStyle = '#ff0055'; 
            }
        });
    }

    function moverJugador() {
        jugador.x += jugador.dx;

        // Evitamos que la nave se salga por la izquierda o derecha
        if (jugador.x < 0) jugador.x = 0;
        if (jugador.x + jugador.ancho > canvas.width) jugador.x = canvas.width - jugador.ancho;
    }

    function moverBalas() {
        balas.forEach((bala, index) => {
            bala.y -= velocidadBala; // Van hacia arriba (Y disminuye)
            
            // Si la bala se fue al cielo, la borramos para ahorrar memoria
            if (bala.y < 0) {
                balas.splice(index, 1);
            }
        });
    }

    function moverAliens() {
        let tocarBorde = false;

        // Movemos a todos los aliens
        aliens.forEach(alien => {
            if (alien.vivo) {
                alien.x += alienDx;
                
                // Chequeamos si alguno tocó la pared derecha o izquierda
                if (alien.x + alienAncho > canvas.width || alien.x < 0) {
                    tocarBorde = true;
                }
            }
        });

        // Si tocaron pared, todo el grupo baja y cambia de dirección
        if (tocarBorde) {
            alienDx = -alienDx; 
            aliens.forEach(alien => {
                if (alien.vivo) {
                    alien.y += alienDy;
                }
            });
        }
    }

    // Aquí pasa la magia de detectar impactos
    function detectarColisiones() {
        balas.forEach((bala, bIndex) => {
            aliens.forEach((alien, aIndex) => {
                if (alien.vivo) {
                    // Esta matemática verifica si dos rectángulos se superponen
                    if (
                        bala.x < alien.x + alienAncho &&
                        bala.x + bala.ancho > alien.x &&
                        bala.y < alien.y + alienAlto &&
                        bala.y + bala.alto > alien.y
                    ) {
                        // ¡BOOM!
                        alien.vivo = false;
                        balas.splice(bIndex, 1); // Adiós bala
                        puntuacion += 10;
                        displayPuntos.innerText = puntuacion;
                    }
                }
            });
        });

        // Verificar si nos invadieron (si tocan nuestra altura)
        aliens.forEach(alien => {
            if (alien.vivo) {
                if (alien.y + alienAlto >= jugador.y) {
                    finJuego(false); // Perdimos
                }
            }
        });
    }

    function verificarNivel() {
        // Contamos cuántos quedan vivos
        const vivos = aliens.filter(alien => alien.vivo).length;
        
        if (vivos === 0) {
            // ¡Nivel superado!
            nivel++;
            displayNivel.innerText = nivel;
            
            // Hacemos que vayan más rápido para aumentar el reto
            if (alienDx > 0) alienDx += 0.5;
            else alienDx -= 0.5;

            crearAliens(); // Traemos refuerzos enemigos
        }
    }

    function finJuego(ganador) {
        juegoActivo = false;
        cancelAnimationFrame(animacionId); // Detenemos el bucle
        
        mensajeEstado.style.visibility = 'visible';
        mensajeEstado.style.color = 'red';
        mensajeEstado.innerText = "¡GAME OVER! La invasión ha triunfado.";
        
        btnIniciar.disabled = false;
        btnIniciar.innerText = "Reintentar";
    }

    // Configuración para botones en pantalla táctil
    const btnIzq = document.getElementById('btn-izq');
    const btnDer = document.getElementById('btn-der');
    const btnFuego = document.getElementById('btn-disparo');

    // Manejo eventos de mouse y touch para que funcione en PC y Celular
    btnIzq.addEventListener('mousedown', () => jugador.dx = -jugador.velocidad);
    btnIzq.addEventListener('mouseup', () => jugador.dx = 0);
    btnIzq.addEventListener('touchstart', (e) => { e.preventDefault(); jugador.dx = -jugador.velocidad; });
    btnIzq.addEventListener('touchend', (e) => { e.preventDefault(); jugador.dx = 0; });

    btnDer.addEventListener('mousedown', () => jugador.dx = jugador.velocidad);
    btnDer.addEventListener('mouseup', () => jugador.dx = 0);
    btnDer.addEventListener('touchstart', (e) => { e.preventDefault(); jugador.dx = jugador.velocidad; });
    btnDer.addEventListener('touchend', (e) => { e.preventDefault(); jugador.dx = 0; });

    btnFuego.addEventListener('click', (e) => { e.preventDefault(); if(juegoActivo) disparar(); });

    // Botones del menú
    btnIniciar.addEventListener('click', iniciarJuego);
    btnLobby.addEventListener('click', () => window.location.href = '/Lobby.html');
});