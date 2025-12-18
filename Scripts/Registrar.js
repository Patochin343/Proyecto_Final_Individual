import { db, collection, addDoc, query, where, getDocs } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Referencias a inputs
        const username = document.getElementById('new-username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const btnRegister = document.querySelector('.btn-register');

        // 1. Validaciones básicas
        if (password !== confirmPassword) {
            alert('❌ Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            alert('⚠️ La contraseña es muy corta (mínimo 6 caracteres).');
            return;
        }

        // Efecto de carga
        const textoOriginal = btnRegister.innerHTML;
        btnRegister.disabled = true;
        btnRegister.innerHTML = 'Verificando...';

        try {
            // 2. Verificar si el usuario YA existe en Firebase
            const usuariosRef = collection(db, "usuarios");
            const q = query(usuariosRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                alert('⚠️ Ese nombre de usuario ya está en uso. Elige otro.');
                btnRegister.disabled = false;
                btnRegister.innerHTML = textoOriginal;
                return;
            }

            // 3. Crear el usuario si no existe
            await addDoc(collection(db, "usuarios"), {
                username: username,
                email: email,
                password: password, 
                fechaRegistro: new Date().toISOString()
            });

            alert('✅ ¡Cuenta creada con éxito! Ahora inicia sesión.');
            window.location.href = 'index.html';

        } catch (error) {
            console.error("Error al registrar:", error);
            alert("Hubo un error de conexión. Intenta de nuevo.");
            btnRegister.disabled = false;
            btnRegister.innerHTML = textoOriginal;
        }
    });
});