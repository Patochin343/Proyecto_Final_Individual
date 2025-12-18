// Importamos la conexión desde nuestro archivo de configuración
import { db, collection, addDoc } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        // 1. Obtener datos del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const especialidad = document.getElementById('especialidad').value;
        const mensaje = document.getElementById('mensaje').value;
        const fecha = new Date().toLocaleString(); // Guardamos cuándo se envió

        // Efecto visual de carga
        const btnSubmit = document.querySelector('.btn-submit');
        const originalText = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO A LA NUBE...';

        try {
            // 2. GUARDAR EN FIREBASE
            // "solicitudes_dev" es el nombre de la colección (se crea sola)
            const docRef = await addDoc(collection(db, "solicitudes_dev"), {
                nombre: nombre,
                email: email,
                especialidad: especialidad,
                mensaje: mensaje,
                fecha: fecha
            });

            console.log("Documento escrito con ID: ", docRef.id);
            alert(`¡Recibido! Tu ID de ticket es: ${docRef.id}`);
            contactForm.reset();

        } catch (e) {
            console.error("Error añadiendo el documento: ", e);
            alert("Hubo un error al conectar con el servidor. Intenta de nuevo.");
        } finally {
            // Restaurar botón
            btnSubmit.innerHTML = originalText;
            btnSubmit.disabled = false;
        }
    });
});