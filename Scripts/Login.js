document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue

        const username = usernameInput.value;
        const password = passwordInput.value;

        // Validación simple (puedes cambiar esto luego por una base de datos real)
        if (username.length > 0 && password.length > 0) {
            // Efecto visual o lógica de autenticación
            console.log(`Intentando iniciar sesión con: ${username}`);
            
            alert(`¡Bienvenido, ${username}! Preparando la consola...`);
            
            // Aquí redirigimos al menú principal de los juegos
            // Asumimos que el menú principal se llamará 'Menu.html' o 'index.html'
            window.location.href = 'Lobby.html'; 
        } else {
            alert('Por favor, ingresa un usuario y contraseña válidos.');
        }
    });
});