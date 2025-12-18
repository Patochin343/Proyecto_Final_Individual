import { db, collection, query, where, getDocs } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const btnLogin = document.querySelector('.btn-login');

        // Efecto de carga
        const textoOriginal = btnLogin.innerHTML;
        btnLogin.disabled = true;
        btnLogin.innerHTML = 'Conectando...';

        try {
            // 1. Buscamos en Firebase: Colección "usuarios" donde username == X y password == Y
            const usuariosRef = collection(db, "usuarios");
            // Nota: Firestore requiere un índice compuesto para consultas dobles, 
            // pero si usas el modo de prueba o pocos datos, a veces permite hacerlo así o filtrando en memoria.
            // Para asegurar compatibilidad simple, buscaremos por usuario y validaremos password en código.
            
            const q = query(usuariosRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            let usuarioEncontrado = null;

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.password === password) {
                    usuarioEncontrado = data;
                }
            });

            if (usuarioEncontrado) {
                // 2. ¡Login Exitoso!
                // Guardamos en LocalStorage para que el Lobby sepa quiénes somos
                localStorage.setItem('user_game_portal', JSON.stringify({
                    username: usuarioEncontrado.username,
                    email: usuarioEncontrado.email
                }));

                alert(`¡Bienvenido de nuevo, ${usuarioEncontrado.username}!`);
                window.location.href = '/Lobby.html'; // Redirigir al Lobby
            } else {
                alert('❌ Usuario o contraseña incorrectos.');
                btnLogin.disabled = false;
                btnLogin.innerHTML = textoOriginal;
            }

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Error de conexión con la base de datos.");
            btnLogin.disabled = false;
            btnLogin.innerHTML = textoOriginal;
        }
    });
});