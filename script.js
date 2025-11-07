document.addEventListener("DOMContentLoaded", function() {
    
    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); 
            
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const errorMessage = document.getElementById("errorMessage");

            // Simulación de inicio de sesión:
            if (username.trim() !== "" && password.trim() !== "") {
                // Éxito: Redirige al lobby
                window.location.href = "lobby.html";
            } else {
                // Error: Muestra un mensaje
                errorMessage.textContent = "Por favor, ingresa usuario y contraseña.";
            }
        });
    }

});