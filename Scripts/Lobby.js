document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Verificar si hay usuario logueado
    // Recuperamos el objeto string y lo convertimos a objeto JS
    const storedUser = localStorage.getItem('user_game_portal');
    
    if (!storedUser) {
        // Si no hay usuario guardado, lo mandamos al login
        // Comentamos esto si solo estás probando el diseño sin loguearte
        // window.location.href = '../Login/Login.html';
        
        // Para pruebas, si no hay usuario, ponemos uno por defecto:
        document.getElementById('welcomeMsg').textContent = "Invitado";
    } else {
        const user = JSON.parse(storedUser);
        document.getElementById('welcomeMsg').textContent = `Jugador: ${user.username}`;
    }

    // 2. Lógica de Logout (Cerrar Sesión)
    const logoutBtn = document.getElementById('logoutBtn');
    
    logoutBtn.addEventListener('click', () => {
        const confirmLogout = confirm("¿Seguro que quieres abandonar la partida?");
        
        if (confirmLogout) {
            // Opción A: Borrar el usuario (requiere loguearse de nuevo)
            // localStorage.removeItem('user_game_portal');
            
            // Opción B: Simplemente redirigir al Login
            window.location.href = './Login.html';
        }
    });

    // 3. (Opcional) Efectos de sonido o animaciones al entrar
    console.log("Lobby cargado correctamente.");
});