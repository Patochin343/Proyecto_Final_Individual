document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES DEL JUEGO (ESTADO) ---
    let puntos = 0;
    let fuerzaClic = 1;      // Cuantos puntos gano por cada clic manual
    let autoClics = 0;       // Cuantos puntos gano automáticamente por segundo
    
    // Precios iniciales
    let costoMejoraClic = 10;
    let costoAutoClic = 50;

    // --- CAPTURAMOS LOS ELEMENTOS DEL HTML ---
    const displayPuntos = document.getElementById('puntaje');
    const displayFuerza = document.getElementById('puntos-por-clic');
    const displayAuto = document.getElementById('auto-clics');
    
    const displayCostoMejora = document.getElementById('costo-mejora');
    const displayCostoAuto = document.getElementById('costo-auto');

    const btnClicker = document.getElementById('btn-clicker');
    const btnMejoraClic = document.getElementById('btn-mejora-clic');
    const btnAutoClic = document.getElementById('btn-auto-clic');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnLobby = document.getElementById('btn-lobby');

    // --- FUNCIÓN PRINCIPAL: ACTUALIZAR LA PANTALLA ---
    // Esta función se encarga de que lo que ve el usuario coincida con las variables
    function actualizarInterfaz() {
        displayPuntos.innerText = puntos;
        displayFuerza.innerText = fuerzaClic;
        displayAuto.innerText = autoClics;
        
        displayCostoMejora.innerText = costoMejoraClic;
        displayCostoAuto.innerText = costoAutoClic;

        // Lógica de la tienda: ¿Tengo dinero para comprar?
        // Si no tengo puntos suficientes, el botón se deshabilita (se pone gris)
        btnMejoraClic.disabled = puntos < costoMejoraClic;
        btnAutoClic.disabled = puntos < costoAutoClic;
    }

    // --- EVENTO: HACER CLIC MANUALMENTE ---
    btnClicker.addEventListener('click', () => {
        puntos += fuerzaClic; // Sumamos la fuerza actual
        
        // Pequeña animación visual (opcional pero queda bonito)
        animarClic();
        
        actualizarInterfaz();
    });

    function animarClic() {
        // Hacemos que el botón se achique un poquito muy rápido
        btnClicker.style.transform = "scale(0.95)";
        setTimeout(() => {
            btnClicker.style.transform = "scale(1)";
        }, 50);
    }

    // --- TIENDA: COMPRAR MEJORA DE FUERZA ---
    btnMejoraClic.addEventListener('click', () => {
        if (puntos >= costoMejoraClic) {
            puntos -= costoMejoraClic;      // Cobramos
            fuerzaClic++;                   // Mejoramos
            costoMejoraClic = Math.floor(costoMejoraClic * 1.5); // Subimos el precio para la próxima (inflación xD)
            actualizarInterfaz();
        }
    });

    // --- TIENDA: COMPRAR ROBOT AUTO-CLIC ---
    btnAutoClic.addEventListener('click', () => {
        if (puntos >= costoAutoClic) {
            puntos -= costoAutoClic;
            autoClics++; // Añadimos un robot más
            costoAutoClic = Math.floor(costoAutoClic * 1.5);
            actualizarInterfaz();
        }
    });

    // --- MOTOR DEL JUEGO: AUTO CLICKER ---
    // Esto se ejecuta cada 1000 milisegundos (1 segundo)
    setInterval(() => {
        if (autoClics > 0) {
            puntos += autoClics;
            actualizarInterfaz();
        }
    }, 1000);

    // --- REINICIAR Y SALIR ---
    btnReiniciar.addEventListener('click', () => {
        if(confirm("¿Seguro que quieres borrar todo tu progreso?")) {
            puntos = 0;
            fuerzaClic = 1;
            autoClics = 0;
            costoMejoraClic = 10;
            costoAutoClic = 50;
            actualizarInterfaz();
        }
    });

    btnLobby.addEventListener('click', () => {
        window.location.href = '/Lobby.html';
    });

    // Iniciamos la pantalla con los valores por defecto
    actualizarInterfaz();
});