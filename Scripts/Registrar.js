document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('new-username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Limpiar estilos de error previos
        limpiarErrores([usernameInput, emailInput, passwordInput, confirmPasswordInput]);

        // Obtener valores y quitar espacios vacíos al inicio/final
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // --- 1. VALIDACIONES ---

        // A. Campos vacíos
        if (!username || !email || !password || !confirmPassword) {
            alert('⚠️ Por favor, completa todos los campos.');
            return;
        }

        // B. Longitud de contraseña (mínimo 6 caracteres)
        if (password.length < 6) {
            alert('⚠️ La contraseña es muy corta. Debe tener al menos 6 caracteres.');
            marcarError(passwordInput);
            return;
        }

        // C. Coincidencia de contraseñas
        if (password !== confirmPassword) {
            alert('❌ Error: Las contraseñas no coinciden.');
            marcarError(confirmPasswordInput);
            marcarError(passwordInput);
            return; 
        }

        // D. (Opcional) Verificar si ya existe un usuario para no sobrescribirlo
        if (localStorage.getItem('user_game_portal')) {
            const confirmOverwrite = confirm('⚠️ Ya existe un usuario registrado. ¿Quieres sobrescribirlo?');
            if (!confirmOverwrite) return;
        }

        // --- 2. GUARDADO DE DATOS ---
        
        const user = {
            username: username,
            email: email,
            password: password 
        };

        // Guardar en LocalStorage
        localStorage.setItem('user_game_portal', JSON.stringify(user));

        // --- 3. REDIRECCIÓN ---
        
        alert('✅ ¡Cuenta creada con éxito! Bienvenido, ' + username);
        
        // CORRECCIÓN IMPORTANTE: Ruta relativa a la misma carpeta
        window.location.href = './Login.html';
    });

    function marcarError(input) {
        input.style.borderColor = 'red';
        input.style.backgroundColor = '#ffe6e6'; // Un rojo muy suave de fondo
    }

    function limpiarErrores(inputs) {
        inputs.forEach(input => {
            input.style.borderColor = ''; // Vuelve al borde original
            input.style.backgroundColor = '';
        });
    }
});