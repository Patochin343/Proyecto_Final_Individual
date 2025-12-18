// Importamos todo lo necesario de Firebase
import { db, collection, addDoc, query, orderBy, limit, getDocs } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS ---
    const canvas = document.getElementById('canvas-juego');
    const ctx = canvas.getContext('2d');
    const displayPuntos = document.getElementById('score');
    const displayNivel = document.getElementById('nivel');
    const mensajeEstado = document.getElementById('mensaje-estado');
    const btnIniciar = document.getElementById('btn-iniciar');
    const btnLobby = document.getElementById('btn-lobby');
    const listaLeaderboard = document.getElementById('lista-leaderboard');

    // --- VARIABLES DE JUEGO ---
    let juegoActivo = false;
    let animacionId;
    let puntuacion = 0;
    let nivel = 1;
    let usuarioActual = "Invitado"; // Por defecto

    // Verificamos si hay usuario logueado
    const storedUser = localStorage.getItem('user_game_portal');
    if (storedUser) {
        const userObj = JSON.parse(storedUser);
        usuarioActual = userObj.username;
        console.log("Jugando como:", usuarioActual);
    }

    // --- CONFIGURACIÓN OBJETOS (Nave, Aliens, Balas) ---
    const jugador = {
        x: canvas.width / 2 - 15,
        y: canvas.height - 30,
        ancho: 30,
        alto: 20,
        velocidad: 5,
        dx: 0,
        color: '#00ff00'
    };

    let balas = [];
    const velocidadBala = 7;
    let aliens = [];
    
    const filasAliens = 4;
    const columnasAliens = 8;
    const alienAncho = 30;
    const alienAlto = 20;
    const alienPadding = 10;
    const alienOffsetTop = 30;
    const alienOffsetLeft = 30;
    
    let alienDx = 1;
    let alienDy = 10;

    // Cargar el ranking apenas entramos a la página
    cargarLeaderboard();

    // --- LISTENERS ---
    document.addEventListener('keydown', teclaPresionada);
    document.addEventListener('keyup', teclaSoltada);

    function teclaPresionada(e) {
        if (!juegoActivo) return;
        if (e.key === 'Right' || e.key === 'ArrowRight') jugador.dx = jugador.velocidad;
        else if (e.key === 'Left' || e.key === 'ArrowLeft') jugador.dx = -jugador.velocidad;
        else if (e.key === ' ' || e.code === 'Space') disparar();
    }

    function teclaSoltada(e) {
        if (!juegoActivo) return;
        if (['Right', 'ArrowRight', 'Left', 'ArrowLeft'].includes(e.key)) jugador.dx = 0;
    }

    // --- FUNCIONES PRINCIPALES ---

    function iniciarJuego() {
        if (juegoActivo) return;

        juegoActivo = true;
        puntuacion = 0;
        nivel = 1;
        balas = [];
        alienDx = 1; 
        
        displayPuntos.innerText = puntuacion;
        displayNivel.innerText = nivel;
        mensajeEstado.style.visibility = 'hidden';
        btnIniciar.disabled = true;
        btnIniciar.innerText = "Misión en curso...";

        crearAliens();
        gameLoop();
    }

    function crearAliens() {
        aliens = [];
        for (let c = 0; c < columnasAliens; c++) {
            for (let f = 0; f < filasAliens; f++) {
                let alienX = (c * (alienAncho + alienPadding)) + alienOffsetLeft;
                let alienY = (f * (alienAlto + alienPadding)) + alienOffsetTop;
                aliens.push({ x: alienX, y: alienY, vivo: true });
            }
        }
    }

    function disparar() {
        if (balas.length < 3) {
            balas.push({
                x: jugador.x + jugador.ancho / 2 - 2,
                y: jugador.y,
                ancho: 4,
                alto: 10
            });
        }
    }

    function gameLoop() {
        if (!juegoActivo) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dibujarJugador();
        dibujarBalas();
        dibujarAliens();
        
        moverJugador();
        moverBalas();
        moverAliens();
        
        detectarColisiones();
        verificarNivel();

        animacionId = requestAnimationFrame(gameLoop);
    }

    // --- DIBUJADO Y FÍSICAS (Resumido igual que antes) ---
    function dibujarJugador() {
        ctx.fillStyle = jugador.color;
        ctx.fillRect(jugador.x, jugador.y + 10, jugador.ancho, 10);
        ctx.fillRect(jugador.x + 10, jugador.y, 10, 10);
    }
    function dibujarBalas() {
        ctx.fillStyle = '#ffff00';
        balas.forEach(b => ctx.fillRect(b.x, b.y, b.ancho, b.alto));
    }
    function dibujarAliens() {
        ctx.fillStyle = '#ff0055';
        aliens.forEach(a => {
            if (a.vivo) {
                ctx.fillRect(a.x, a.y, alienAncho, alienAlto);
                ctx.fillStyle = 'black';
                ctx.fillRect(a.x + 5, a.y + 5, 5, 5); 
                ctx.fillRect(a.x + 20, a.y + 5, 5, 5);
                ctx.fillStyle = '#ff0055'; 
            }
        });
    }

    function moverJugador() {
        jugador.x += jugador.dx;
        if (jugador.x < 0) jugador.x = 0;
        if (jugador.x + jugador.ancho > canvas.width) jugador.x = canvas.width - jugador.ancho;
    }
    function moverBalas() {
        balas.forEach((b, i) => {
            b.y -= velocidadBala;
            if (b.y < 0) balas.splice(i, 1);
        });
    }
    function moverAliens() {
        let tocarBorde = false;
        aliens.forEach(a => {
            if (a.vivo) {
                a.x += alienDx;
                if (a.x + alienAncho > canvas.width || a.x < 0) tocarBorde = true;
            }
        });
        if (tocarBorde) {
            alienDx = -alienDx;
            aliens.forEach(a => { if (a.vivo) a.y += alienDy; });
        }
    }

    function detectarColisiones() {
        balas.forEach((b, bi) => {
            aliens.forEach((a, ai) => {
                if (a.vivo && b.x < a.x + alienAncho && b.x + b.ancho > a.x && b.y < a.y + alienAlto && b.y + b.alto > a.y) {
                    a.vivo = false;
                    balas.splice(bi, 1);
                    puntuacion += 10;
                    displayPuntos.innerText = puntuacion;
                }
            });
        });

        aliens.forEach(a => {
            if (a.vivo && a.y + alienAlto >= jugador.y) finJuego();
        });
    }

    function verificarNivel() {
        if (aliens.filter(a => a.vivo).length === 0) {
            nivel++;
            displayNivel.innerText = nivel;
            alienDx > 0 ? alienDx += 0.5 : alienDx -= 0.5;
            crearAliens();
        }
    }

    // --- FIN DEL JUEGO Y LEADERBOARD ---
    
    function finJuego() {
        juegoActivo = false;
        cancelAnimationFrame(animacionId);
        
        mensajeEstado.style.visibility = 'visible';
        mensajeEstado.style.color = 'red';
        mensajeEstado.innerText = `¡GAME OVER! Puntos: ${puntuacion}`;
        
        btnIniciar.disabled = false;
        btnIniciar.innerText = "Reintentar";

        // Guardar puntaje si es mayor a 0
        if (puntuacion > 0) {
            guardarPuntaje(puntuacion);
        }
    }

    async function guardarPuntaje(puntosFinales) {
        // Solo guardamos si hay un usuario real (no invitado)
        // O si quieres que Invitados guarden, quita este if
        if (usuarioActual === "Invitado") {
            console.log("Puntaje no guardado (Invitado)");
            return;
        }

        try {
            await addDoc(collection(db, "puntajes_space"), {
                usuario: usuarioActual,
                puntos: puntosFinales,
                fecha: new Date().toISOString()
            });
            console.log("Puntaje guardado en la nube");
            // Actualizamos la tabla para ver mi nuevo record
            cargarLeaderboard();
        } catch (e) {
            console.error("Error guardando puntaje: ", e);
        }
    }

    async function cargarLeaderboard() {
        listaLeaderboard.innerHTML = '<li>Cargando...</li>';
        
        try {
            // Consulta: Dame la colección 'puntajes_space', ordénala por 'puntos' descendente, solo 5
            const q = query(collection(db, "puntajes_space"), orderBy("puntos", "desc"), limit(5));
            const querySnapshot = await getDocs(q);
            
            listaLeaderboard.innerHTML = ''; // Limpiar lista
            
            if (querySnapshot.empty) {
                listaLeaderboard.innerHTML = '<li>Sin registros aún</li>';
                return;
            }

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const li = document.createElement('li');
                li.innerHTML = `<span>${data.usuario}</span> <span>${data.puntos}</span>`;
                listaLeaderboard.appendChild(li);
            });

        } catch (e) {
            console.error("Error cargando leaderboard:", e);
            listaLeaderboard.innerHTML = '<li>Error de conexión</li>';
        }
    }

    // Controles Touch
    const btnIzq = document.getElementById('btn-izq');
    const btnDer = document.getElementById('btn-der');
    const btnFuego = document.getElementById('btn-disparo');

    if(btnIzq && btnDer && btnFuego) {
        btnIzq.addEventListener('touchstart', (e) => { e.preventDefault(); jugador.dx = -jugador.velocidad; });
        btnIzq.addEventListener('touchend', (e) => { e.preventDefault(); jugador.dx = 0; });
        btnDer.addEventListener('touchstart', (e) => { e.preventDefault(); jugador.dx = jugador.velocidad; });
        btnDer.addEventListener('touchend', (e) => { e.preventDefault(); jugador.dx = 0; });
        btnFuego.addEventListener('click', (e) => { e.preventDefault(); if(juegoActivo) disparar(); });
    }

    btnIniciar.addEventListener('click', iniciarJuego);
    btnLobby.addEventListener('click', () => window.location.href = '/Lobby.html');
});